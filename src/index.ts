import babel, { NodePath, PluginObj } from '@babel/core'
import * as t from 'babel-types'
import path from 'path'

const slashChar = path.sep

interface IPluginOptions {
  propertyName?: string
  dirLevel?: number
  filename?: string
}

type FunctionType =
  | t.FunctionDeclaration
  | t.FunctionExpression
  | t.ArrowFunctionExpression
  | t.ClassMethod

function nameForReactComponent(
  path: NodePath<FunctionType>
): t.Identifier | null {
  const { parentPath } = path

  if (!t.isArrowFunctionExpression(path.node) && t.isIdentifier(path.node.id)) {
    return path.node.id
  }

  // @ts-ignore
  if (t.isVariableDeclarator(parentPath) && t.isIdentifier(parentPath.node.id)) {
    // @ts-ignore
    return parentPath.node.id
  }

  // @ts-ignore
  if (t.isClassMethod(path.node) && t.isIdentifier(parentPath.parentPath?.node.id)) {
    // @ts-ignore
    return parentPath.parentPath?.node.id;
  }

  return null
}

interface File extends t.File {
  opts: any
}

interface IState {
  opts?: Partial<IPluginOptions>
  filename: string
  file: File
}

export default function plugin({
  types: t,
}: typeof babel): PluginObj<IState> {
  return {
    name: 'babel-plugin-react-gen-unique-id',
    visitor: {
      Function(programPath, state) {
        const propertyName = state.opts?.propertyName
          ? state.opts.propertyName
          : 'data-spm'
        // const dirLevel = state.opts?.dirLevel ? state.opts.dirLevel : 1

        const identifier = nameForReactComponent(
          (programPath as unknown) as NodePath<FunctionType>
        )

        if (!identifier) {
          return
        }
        
        const splits = state.filename.split(slashChar)
        if (!splits || !splits.length) {
          return
        }

        // const dirNames = splits.slice(-1 - dirLevel, -1)
        // const absoluteFilePath = state.filename;
        // const fileName = path.basename(absoluteFilePath).split('.')[0]; // splits[splits.length - 1].split('.')[0]
        const rootDir = state.file.opts.root
        const relativePathSplits = state.filename.replace(rootDir, '').split('.')[0].split(slashChar)
        const fileIdentifier = `${relativePathSplits.join('_')}_${identifier.name}`

        const prevLiterals: { [key: string]: number } = {}
        programPath.traverse({
          JSXElement(jsxPath) {
            let nodeName = ''
            let dataIDDefined = false

            // Traverse once to get the element node name (div, Header, span, etc)
            jsxPath.traverse({
              JSXOpeningElement(openingPath) {
                openingPath.stop() // Do not visit child nodes again
                const identifierNode: t.JSXIdentifier = (openingPath.get('name')
                  .node as unknown) as t.JSXIdentifier

                nodeName = identifierNode.name
                openingPath.traverse({
                  JSXAttribute(attributePath) {
                    // If the data attribute doesn't exist, then we append the data attribute
                    const attributeName = attributePath.get('name').node.name
                    if (!dataIDDefined) {
                      dataIDDefined = attributeName === propertyName
                    }
                  },
                })
              },
            })

            if (!dataIDDefined && nodeName && nodeName !== 'Fragment') {
              if (
                typeof prevLiterals[`${fileIdentifier}_${nodeName}`] ===
                'undefined'
              ) {
                prevLiterals[`${fileIdentifier}_${nodeName}`] = 0
              } else {
                prevLiterals[`${fileIdentifier}_${nodeName}`] += 1
              }
              const siblingIter = prevLiterals[`${fileIdentifier}_${nodeName}`]

              jsxPath.node.openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(propertyName),
                  t.stringLiteral(
                    `${fileIdentifier}_${nodeName}${siblingIter > 0 ? '_' + siblingIter : ''}`
                  )
                )
              )
            }
          },
        })
      },
    },
  }
}
