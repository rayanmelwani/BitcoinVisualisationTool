import { Handle, Position } from 'react-flow-renderer';
import React, { memo, useState } from 'react';
import reporticon from "./report-icon.jpeg";
import searchicon from "./search-icon.png";

function CustomNode(props) {
  //created custom react flow node in order to display customised info about address nodes

  const [click, setClick] = useState(false);

  return (
    <div className={props.data.nodecss}>
      <Handle type="target" position={Position.Left}/>
        <div style={{display:"flex", flexDirection:"column", alignContent:"space-between"}}>
          <label><b> Entity: {props.data.tags} </b>
          <a className="btn btn-danger" style={{fontSize: "8px", textAlign:"right", padding:"1.5%", margin:"0px", marginLeft:"1%"}}
          href={"https://www.bitcoinabuse.com/reports/"+props.data.address}><b>{props.data.reports}</b></a></label>
          <label><em style={{lineBreak: "anywhere"}}> {props.data.address} </em></label>
          <label>Balance: {props.data.balanceBTC}₿ | ${props.data.balanceUSD} </label>
          <div>
            <button className={props.data.buttoncss} disabled={click} onClick={() => {
              if(click === false){
                setClick(true);
                props.data.viewTransactions(props);
              }
            }}><b>{props.data.explore}</b></button>
            <a href={"https://walletexplorer.com/address/"+props.data.address} style={{width:"12%",
            position:"absolute", transform: "translate(230%, 0)", borderRadius: "100%"}}>
            <img style={{height:"90%",width:"90%",borderRadius: "100%"}} src={searchicon} /></a>
          </div>
        </div>
      <Handle type="source" position={Position.Right}/>
    </div>
  );
}

export default memo(CustomNode);
