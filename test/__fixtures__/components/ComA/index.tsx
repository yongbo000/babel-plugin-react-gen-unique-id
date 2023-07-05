class ComB extends React.Component {
  render() {
    return <div>
      <p>BBB</p>
    </div>
  }
}

const ComA = () => {
  return (
    <div className="ComA">
      <>
      i'am A
      </>
      {[1,2,3].map(() => {
        return <ComB />;
      })}
      {[1,2].map(() => (<div>1111</div>))}
    </div>
  );
}

export default ComA;