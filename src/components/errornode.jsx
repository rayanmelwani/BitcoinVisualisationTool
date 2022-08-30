 import { Handle, Position } from 'react-flow-renderer';
import React, { memo, useState } from 'react';

function ErrorNode(props) {

  const [click, setClick] = useState(false);

  return (
    <div className={"error-node"} style={{display:"flex", flexDirection:"column", alignContent:"space-between"}}>
      <div>
        <label><b>ERROR</b>
        <button className="btn btn-light" onClick={props.data.clear}>X</button></label>
      </div>
      <div style={{textAlign:"center", fontSize:"10px", lineBreak: "anywhere"}}>{props.data.msg}</div>
    </div>
  );
}

export default memo(ErrorNode);
