# babel-plugin-react-auto-unique-id

> ## Example

#### in

```
const Foo = () =>
  <Bar>
    <div>
  </Bar>
```

#### out

```
const Foo = () =>
  <Bar data-test-id="Foo-Bar">
    <div data-test-id="Foo-Bar-div">
  </Bar>
```

## Useful with styled-components

#### in

```
const Wrapper = styled.div`...`

const Bar = styled.div`...`

const Foo = () =>
  <Wrapper>
    <Bar>
  </Wrapper>
```

#### out

```
const Wrapper = styled.div`...`

const Bar = styled.div`...`

const Foo = () =>
  <Wrapper data-test="Foo-Wrapper">
    <Bar data-test="Foo-Wrapper-Bar">
  </Wrapper>
```

## Install

`yarn add davidgustys/babel-plugin-react-auto-unique-id`

or

`npm install davidgustys/babel-plugin-react-auto-unique-id`

## Usage

in .babelrc

```
"plugins": [
  "babel-plugin-react-auto-unique-id",
  ...
```
