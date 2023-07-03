function Sibling() {
  return <div />
}

function Siblings() {
  return (
    <div>
      hello
      <Sibling data-id="i-exist"/>
      <Sibling/>
    </div>
  )
}
