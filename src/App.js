import React, { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { applyNodeChanges, applyEdgeChanges,addEdge, Background, Controls, MiniMap} from 'react-flow-renderer';
import './App.css';
import SearchAppBar from './components/search-bar.jsx';
import {getNodeInfo, getInNeighbours, getOutNeighbours, checkBitcoinAbuse, checkBitcoinWhosWho, checkWalletExplorer} from './components/api-calls.jsx';
import {testedges,testnodes,initelements} from './components/elements.jsx';
import DiscreteSlider from './components/slider.jsx';
import CustomNode from './components/customnode.jsx';
import ErrorNode from './components/errornode.jsx';
import './components/customnode.css'
import './components/errornode.css'

const nodeTypes = { CustomNode: CustomNode, ErrorNode: ErrorNode};

function App() {

  //react flow states
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  //additional state values
  const [data, setData] = useState([]);
  const [barval, setBarval] = useState(5);
  const [activate,setActivate] = useState(false);

  //reactflow handlers
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes,nds)),[setNodes]);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes,eds)),[setEdges]);

  const clearFlow = () => {
    setEdges([]);
    setNodes([]);
    setActivate(false);
  };

  const handleBar = (v) => {
    setBarval(v);
  };

  const addInitNode = (data, info, label) => {

      setActivate(true);
      //grabbing data about nodes
      var in_txs = data.no_incoming_txs;
      var out_txs = data.no_outgoing_txs;
      var address = data.address;
      var entity = data.entity;
      var balance_btc = data.balance.value/100000000;
      var balance_eur = data.balance.fiat_values[0].value;
      var balance_usd = data.balance.fiat_values[1].value;
      var balance_formatBTC = new Intl.NumberFormat('en-US').format(balance_btc)
      var balance_formatUSD = new Intl.NumberFormat('en-US').format(balance_usd);
      var total_recieved_usd = data.total_received.fiat_values[1].value;
      var total_sent_usd = data.total_spent.fiat_values[1].value;
      var explore = "←EXPLORE→";

      //grabbing label (from wallet explorer or graphsense)
      var tags = 'Unknown';
      if(data.tags[0] !== undefined){
        tags = data.tags[0].label;
      } else if(label.label !== undefined) {
        tags = label.label;
      }

      //defines colour of node (css)
      var nodecss = "custom-node";
      var buttoncss = "btn btn-info";
      if(info.count !== null){
        if(info.count > 1 && info.count <= 5){
          nodecss = "custom-node-red1";
          buttoncss = "btn btn-warning";
        } else if(info.count > 5 && info.count <= 20){
          nodecss = "custom-node-red2";
          buttoncss = "btn btn-warning";
        } else if(info.count > 20){
          nodecss = "custom-node-red3";
          buttoncss = "btn btn-danger";
        }
      };

      //creates node object
      const new_node = [{
        id: '0',
        type: 'CustomNode',
        data: {address:address, rawbalance:balance_btc, balanceBTC:balance_formatBTC, balanceUSD: balance_formatUSD,
          total_recieved:total_recieved_usd, total_sent:total_sent_usd, tags:tags,
          viewTransactions:showTransactions, entity:entity, nodecss:nodecss, in_txs:in_txs, out_txs:out_txs,
          buttoncss:buttoncss, reports:info.count, explore:explore},
        position: {x: 650, y: 300},
        draggable: true,
      }]
      setNodes(new_node);
    };

  const addErrorNode = useCallback((data) => {
      //adds error node with message in case invalid input
      var new_node = [{
        id: '0',
        type: 'ErrorNode',
        data: {msg:data, clear:clearFlow},
        position: {x: 650, y: 300},
        draggable: true,
      }]
      setNodes(new_node);
    }, [reactFlowInstance]
  );

  const calculateAPIcalltimes = async (address) => { //function to perform analysis on API calls
    var temp = 0;
    var results = [];
    //makes 100 API calls and calculates averages & standard deviations
    while(temp < 100){
      var t0 = performance.now();
      // var data = await getNodeInfo(address);
      // var data = await checkBitcoinAbuse(address);
      var data = await checkWalletExplorer(address);
      var t1 = performance.now();
      results.push(t1-t0);
      console.log("API call takes: " + (t1-t0) + " milliseconds.");
      temp += 1;
    }
    console.log(results);
    const average = results.reduce((a, b) => a + b, 0) / results.length;
    const stddev = Math.sqrt(results.map(x => Math.pow(x - average, 2)).reduce((a, b) => a + b) / results.length)
    console.log("average: ", average);
    console.log("stddev: ", stddev);
  }

  const handleEither = async (address) => {
    //Function to handle either keyboard enter press or enter button press
    var data = await getNodeInfo(address);
    if(data === undefined){
      if(address.length < 20){
        var msg = "Input address is too short!";
      } else if(address.length > 40){
        var msg =  "Input address is too long!";
      } else {
        var msg = "Invalid bitcoin address!";
      }
      addErrorNode(msg);
    } else if(data.status === 404){ //if unable to get data, logs error not found
      var msg = data.detail;
      if(address.length < 20){
        msg += ". Input address is too short!";
      } else if(address.length > 40){
        msg +=  ". Input address is too long!";
      } else {
        msg += ". Invalid bitcoin address!";
      }
      addErrorNode(msg);
    } else { //otherwise creates node
      //gets necessary info and calls init node function (to create node)
      const info = await checkBitcoinAbuse(address);
      const label = await checkWalletExplorer(address);
      addInitNode(data, info, label);
    }
  }

  //function to handle submit button
  const handleSubmit = (address) => {
    var addr = address.replace(/[^a-zA-Z0-9]/g, '');
    handleEither(addr);
  }

  //function to handle enter key press
  const handleEnter = (e) => {
    var addr = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    handleEither(addr);
  };

  //function that checks if node already exists in node list
  function checkExists(neighbour, curr_nodes){
    for(const n in curr_nodes){
      if(n.address === neighbour.id){
        return true;
      }
    }
    return false;
  };

  //function to show transactions (explore button on nodes being pressed)
  const showTransactions = async (current_node) => {
    //The commented out code in this section was used to calculate the time it takes
    //to complete the explore button algorithm (discussed in Evaluation)
    // var results = [];
    var temp = 0;

    current_node.data.explore = "LOADING...";

    //only running it once, was used to run this algorithm multiple times for
    //purpose of algorithm evaluation
    while(temp < 1){
      // var t0 = performance.now();
      // var count = 0;

      if(current_node.id <= 0) {
            var in_arr = [];
            var next_page = '';
            do {
              var in_neighbours = await getInNeighbours(current_node.data.address, next_page);

              // count += in_neighbours.neighbors.length;

              next_page = in_neighbours.next_page;
              for(const n of in_neighbours.neighbors){
                if(!checkExists(n, nodes)){ //if node does not exist
                  if(in_arr.length < barval){ //inserts first num of items
                    in_arr.push([n.id,n.received.value/100000000]);
                    if(in_arr.length === barval){ //sort when reaches end
                      in_arr.sort((a,b) => {
                        return b[1] - a[1];
                      });
                    }
                  } else { //otherwise compares to last element in array
                    if(n.received.value/100000000 > in_arr[barval-1][1]){
                      in_arr.push([n.id,n.received.value/100000000]); //if greater then push, sort and pop
                      in_arr.sort((a,b) => {
                        return b[1] - a[1];
                      });
                      in_arr.pop();
                    }
                  }
                  if(in_arr.length > 1){ //cleaning sort in case 2 or 3 transactions
                    in_arr.sort((a,b) => {
                      return b[1] - a[1];
                    });
                  }
                }
              }
            } while (in_neighbours.next_page);
          }

        // console.log("in_nodes",count);
        // count = 0;

        if(current_node.id >= 0) {
              var out_arr = [];
              var next_page = '';
              do {
                var out_neighbours = await getOutNeighbours(current_node.data.address, next_page);

                // count += out_neighbours.neighbors.length;

                next_page = out_neighbours.next_page;
                for(const n of out_neighbours.neighbors){
                  if(!checkExists(n, nodes)){ //if node does not exist
                    if(out_arr.length < barval){ //inserts first num of items
                      out_arr.push([n.id,n.received.value/100000000]);
                      if(out_arr.length === barval){ //sort when reaches end
                        out_arr.sort((a,b) => {
                          return b[1] - a[1];
                        });
                      }
                    } else { //otherwise compares to last element in array
                      if(n.received.value/100000000 > out_arr[barval-1][1]){
                        out_arr.push([n.id,n.received.value/100000000]); //if greater then push, sort and pop
                        out_arr.sort((a,b) => {
                          return b[1] - a[1];
                        });
                        out_arr.pop();
                      }
                    }
                    if(out_arr.length > 1){ //cleaning sort in case 2 or 3 transactions
                      out_arr.sort((a,b) => {
                        return b[1] - a[1];
                      });
                    }
                  }
                }
              } while (out_neighbours.next_page);
            }
        // console.log("out_nodes",count);
        // var t1 = performance.now();
        // results.push(t1-t0);
        // console.log("array population takes: " + (t1-t0) + " milliseconds.");
        temp += 1;
      }
      // console.log(results);
      // const average = results.reduce((a, b) => a + b, 0) / results.length;
      // const stddev = Math.sqrt(results.map(x => Math.pow(x - average, 2)).reduce((a, b) => a + b) / results.length)
      // console.log("average: ", average);
      // console.log("stddev: ", stddev);

      if(current_node.id <= 0){
        addInputNodes(in_arr, current_node);
      }
      if(current_node.id >= 0){
        addOutputNodes(out_arr, current_node);
      }
      current_node.data.explore = "EXPLORED";
  }

  const addOutputNodes = async (data, current_node) => { //function that adds output nodes to flow

      const num = data.length;
      var count = parseInt(current_node.id)*num + 1;
      const angle = Math.PI / (num+1);
      var temp = 1;

      var maxtrans = data[0][1];

      //iterates through array of nodes from explore button, generating nodes
      //and appending them to the nodes array
      for(const adr of data){
        var out_data = await getNodeInfo(adr[0]);
        var label = await checkWalletExplorer(adr[0]);
        var in_txs = out_data.no_incoming_txs;
        var out_txs = out_data.no_outgoing_txs;
        var address = out_data.address;
        var entity = out_data.entity;
        var balance_btc = out_data.balance.value/100000000;
        var balance_eur = out_data.balance.fiat_values[0].value;
        var balance_usd = out_data.balance.fiat_values[1].value;
        var balance_formatBTC = new Intl.NumberFormat('en-US').format(balance_btc);
        var balance_formatUSD = new Intl.NumberFormat('en-US').format(balance_usd);
        var total_recieved_usd = out_data.total_received.fiat_values[1].value;
        var total_sent_usd = out_data.total_spent.fiat_values[1].value;
        var explore = "EXPLORE→";

        //getting graphsense or wallet explorer labels
        var tags = 'Unknown';
        if(out_data.tags[0] !== undefined){
          tags = out_data.tags[0].label;
        }
        else if(label.label !== undefined) {
          tags = label.label;
        }

        //getting bitcoin abuse information - defines colour of node
        const info = await checkBitcoinAbuse(address);
        var nodecss = "custom-node";
        var buttoncss = "btn btn-info";
        if(info.count !== null){
          if(info.count > 1 && info.count <= 5){
            nodecss = "custom-node-red1";
            buttoncss = "btn btn-warning";
          } else if(info.count > 5 && info.count <= 20){
            nodecss = "custom-node-red2";
            buttoncss = "btn btn-warning";
          } else if(info.count > 20){
            nodecss = "custom-node-red3";
            buttoncss = "btn btn-danger";
          }
        };

        var angle2 = angle*temp;

        //creates node object
        const new_node = [{
          id: count.toString(),
          type: 'CustomNode',
          data: {address:address, explore:explore,rawbalance:balance_btc, balanceUSD:balance_formatUSD, balanceBTC:balance_formatBTC, total_recieved:total_recieved_usd,
            total_sent:total_sent_usd, tags:tags, viewTransactions:showTransactions, in_txs:in_txs, out_txs:out_txs,
            entity:entity,nodecss:nodecss, buttoncss:buttoncss, reports:info.count},
          position: {x: current_node.xPos + 350 + Math.sin(angle2)*num/10*730, y: current_node.yPos - Math.cos(angle2)*num/10*800},
          draggable: true,
        }]

        //calculates width of edge connecting nodes (figures out ratio between transactions
        //or ratio between transaction and balance)
        var btc_transfer = new Intl.NumberFormat('en-US').format(adr[1]) + " BTC";
        var edgewidth = 1;
        if(maxtrans/3 > current_node.data.rawbalance){
          edgewidth = Math.round((adr[1] / maxtrans)*7);
          if(edgewidth < 1){
            edgewidth = 1;
          } else if(edgewidth > 20) {
            edgewidth = 20;
          };
        } else {
          edgewidth = Math.round((adr[1]/current_node.data.rawbalance)*5);
          if(edgewidth < 1){
            edgewidth = 1;
          } else if(edgewidth > 20) {
            edgewidth = 20;
          };
        }

        //create edge object
        const edge_id = 'edge_' + current_node.id + '_' + count.toString();
        const new_edge = [{
          id: edge_id,
          source: current_node.id,
          target: count.toString(),
          className:'normal-edge',
          label:btc_transfer,
          style:{strokeWidth:edgewidth},
        }]

        setNodes(nodes => nodes.concat(new_node));
        setEdges(edges => edges.concat(new_edge));

        count += 1;
        temp += 1;
      }
    }

  const addInputNodes = async (data, current_node) => { //function that adds output nodes to flow

      const num = data.length;
      var count = parseInt(current_node.id)*num - 1;
      const angle = Math.PI / (num+1);
      var temp = -1;

      var maxtrans = data[0][1];

      //iterates through array of nodes from explore button, generating nodes
      //and appending them to the nodes array
      for(const adr of data){
        var in_data = await getNodeInfo(adr[0]);
        var label = await checkWalletExplorer(adr[0]);
        var in_txs = in_data.no_incoming_txs;
        var out_txs = in_data.no_outgoing_txs;
        var address = in_data.address;
        var entity = in_data.entity;
        var balance_btc = in_data.balance.value/100000000;
        var balance_eur = in_data.balance.fiat_values[0].value;
        var balance_usd = in_data.balance.fiat_values[1].value;
        var balance_formatBTC = new Intl.NumberFormat('en-US').format(balance_btc);
        var balance_formatUSD = new Intl.NumberFormat('en-US').format(balance_usd);
        var total_recieved_usd = in_data.total_received.fiat_values[1].value;
        var total_sent_usd = in_data.total_spent.fiat_values[1].value;
        var explore = "←EXPLORE";

        //getting graphsense or wallet explorer labels
        var tags = 'Unknown';
        if(in_data.tags[0] !== undefined){
          tags = in_data.tags[0].label;
        }
        else if(label.label !== undefined) {
          tags = label.label;
        }

        //getting bitcoin abuse information - to determine colour of node
        const info = await checkBitcoinAbuse(address);
        var nodecss = "custom-node";
        var buttoncss = "btn btn-info";
        if(info.count !== null){
          if(info.count > 1 && info.count <= 5){
            nodecss = "custom-node-red1";
            buttoncss = "btn btn-warning";
          } else if(info.count > 5 && info.count <= 20){
            nodecss = "custom-node-red2";
            buttoncss = "btn btn-warning";
          } else if(info.count > 20){
            nodecss = "custom-node-red3";
            buttoncss = "btn btn-danger";
          }
        };

        var angle2 = 2 * Math.PI + angle*temp;

        //creates node object
        const new_node = [{
          id: count.toString(),
          type: 'CustomNode',
          data: {address:address, explore:explore,rawbalance:balance_btc, balanceUSD:balance_formatUSD, balanceBTC:balance_formatBTC, total_recieved:total_recieved_usd,
            total_sent:total_sent_usd, tags:tags, viewTransactions:showTransactions, in_txs:in_txs, out_txs:out_txs,
            entity:entity, nodecss:nodecss, buttoncss:buttoncss, reports:info.count},
          position: {x: current_node.xPos - 350 + Math.sin(angle2)*num/10*730, y: current_node.yPos - Math.cos(angle2)*num/10*800},
          draggable: true,
        }]

        //calculates width of edge connecting nodes (figures out ratio between transactions
        //or ratio between transaction and balance)
        var btc_transfer = new Intl.NumberFormat('en-US').format(adr[1]) + " BTC";
        var edgewidth = 1;
        if(maxtrans/3 > current_node.data.rawbalance){
          edgewidth = Math.round((adr[1] / maxtrans)*7);
          if(edgewidth < 1){
            edgewidth = 1;
          } else if(edgewidth > 20) {
            edgewidth = 20;
          };
        } else {
          edgewidth = Math.round((adr[1]/current_node.data.rawbalance)*5);
          if(edgewidth < 1){
            edgewidth = 1;
          } else if(edgewidth > 20) {
            edgewidth = 20;
          };
        }

        //creates edge object
        const edge_id = 'edge_' + current_node.id + '_' + count.toString();
        const new_edge = [{
          id: edge_id,
          target: current_node.id,
          source: count.toString(),
          className:'normal-edge',
          width:10,
          label:btc_transfer,
          style:{strokeWidth:edgewidth},
        }]

        setNodes(nodes => nodes.concat(new_node));
        setEdges(edges => edges.concat(new_edge));

        count -= 1;
        temp -= 1;
      }
    };

  //defines size of react flow interactive graphical display
  const temp = 	window.innerHeight * 0.85;
  var height = temp.toString() + "px";
  const graphStyles = { width: "100%", height:height };

  return (
    <Fragment>
      <SearchAppBar handleSubmit={handleSubmit} handleEnter={handleEnter} handleBar={handleBar} clearFlow={clearFlow} activate={activate}/>
      <ReactFlow defaultNodes={nodes} nodeTypes={nodeTypes} defaultEdges={edges} fitView style={graphStyles}
      snapToGrid = {true} snapGrid={[16,16]}>
      <Background color="888" gap={12} />
      <Controls/>
      <MiniMap nodeColor={n=>{
        if(n.type === 'input') return 'blue';
          return '#FFCC00'
      }} />
      </ReactFlow>
      <div style={{textAlign:"right", fontSize:"70%"}}>
        Data Sources: <a href="https://graphsense.info/">GraphSense</a>, <a href="https://www.bitcoinabuse.com/">BitcoinAbuse</a>, <a href="https://www.walletexplorer.com/">WalletExplorer</a>
      </div>
    </Fragment>
  );
}

export default App;
