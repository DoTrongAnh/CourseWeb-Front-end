import React, { useState } from "react";
import "./App.css";
import "bulma/css/bulma.css"
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Font, Page, Text, View, Document, StyleSheet, pdf, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table';
import { saveAs } from 'file-saver';
import ReactPDF from '@react-pdf/renderer';

Font.register({ family: 'Roboto', fonts: [
  {src: './font-roboto/Roboto-Bold.ttf', fontWeight: 'bold'},
  {src: './font-roboto/Roboto-Regular.ttf'}
  ] });


const MyDocument = (props) => {
  const outline = JSON.parse(props.value);
  //var components = [];
  var i = 0;
  while(i < outline.components.length){
    //var comp = {name:"",outcomes:"",weight:0.0};
    //comp.name = outline.components[i].name;
    //comp.outcomes = outline.components[i].outcomes.length > 0? outline.components[i].outcomes.join() : "n/a";
   // comp.weight = outline.components[i].weight;
    //components = [...components, comp];
  }
  return(
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>1. Calendar Information{"\n"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>2. Learning Outcomes{"\n"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>3. Final Grade Determination{"\n"}</Text>
      </View>
    </Page>
  </Document>
);}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  title: {
    fontWeight: "semibold"
  },
  text: {
  },
  textRight:{
    textAlign: "right"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const OutlineDoc = (props) => {
  const outline = JSON.parse(props.value);
  var components = [];
  var i = 0;
  while(i < outline.components.length){
    var comp = {name:"",outcomes:"",weight:0.0};
    comp.name = outline.components[i].name;
    comp.outcomes = outline.components[i].outcomes.length > 0? outline.components[i].outcomes.join() : "n/a";
    comp.weight = outline.components[i++].weight;
    components = [...components, comp];
  }
  return (
  <Document>
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>1. Calendar Information{"\n"}</Text>
        <Text style={styles.text}>{outline.description + "\n"}Course hours:{"\t"+outline.hours+"\n"}Course credits:{"\t"+outline.credits+"\n"}</Text>
      </View>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>2. Learning Outcomes{"\n"}</Text>
        <Text style={styles.text}>At the end of this course, you will be able to:{"\n"}</Text>
        {outline.courseOutcomes.map((outcome, index) => {
          const header = "" + (index + 1) + ". ";
          return (
           <Text style={styles.text}>
              {header + outcome + "\n"}
            </Text>
          );
        })}
      </View>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>3. Final Grade Determination{"\n"}</Text>
        <Table data={components}>
        <TableHeader textAlign={"center"}>
        <TableCell weighting={0.3}>
        Components
        </TableCell>
        <TableCell weighting={0.3}>
        Learning outcome(s)
        </TableCell>
        <TableCell weighting={0.3}>
        Weight
        </TableCell>
        </TableHeader>
        <TableBody textAlign={"center"}>
        <DataTableCell getContent={(r)=>r.name} />
        <DataTableCell getContent={(r)=>r.outcomes} />
        <DataTableCell getContent={(r)=>r.weight + "%"} />
        </TableBody>
        </Table>
        <Text style={styles.textRight} >Total:{"\t" + components.reduce((count, comp)=>{return count+comp.weight;},0)+"%"}</Text>
      </View>
    </Page>
  </Document>
);}

const LazyDownloadPDFButton = (props) => (
  <button
    onClick={async () => {
      const doc = <OutlineDoc value={props.value} />;
      const asPdf = pdf([]); // {} is important, throws without an argument
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      saveAs(blob, props.name);
    }}
  >Download PDF</button>
);

//Input form to create new outline
function OutlineInputForm(props) {
  
  const [inputList, setInputList] = useState([{ courseOutcome: "n/a"}]);
  const [titles, setTitles] = useState({
                              description: "n/a",
                              hours: "n/a",
                              courseName:"n/a",
                              courseCode:"n/a"});
  const [components, setComponents] = useState([{
    name:"n/a",
    outcomes:[0],
    weight:0.0
  }]);
  const [credits, setCredits] = useState(3);
const handleRadioChange = (event, index1, index2) => {
	var comp = [...components];
	if(event.target.checked) comp[index1].outcomes = [...new Set([...comp[index1].outcomes,index2+1])];
	else {
    const id = comp[index1].outcomes.indexOf(index2 + 1);
    if(id >= 0) comp[index1].outcomes.splice(id, 1);
    }
  const id0 = comp[index1].outcomes.indexOf(0);
  if(id0 >= 0) comp[index1].outcomes.splice(id0, 1);
  comp[index1].outcomes.sort();
  setComponents(comp);
};
 const handleWeightChange = (event, index) =>{
  const { value } = event.target;
  const newWeight = parseFloat(value)
  const temp = [...components];
  temp[index].weight = isNaN(newWeight)? 0.0 : newWeight;
  setComponents(temp);
 };

const handleInputChange = (e, index) => {
  const { name, value } = e.target;
  const list = [...inputList];
  list[index][name] = value;
  setInputList(list);
};

const handleRemoveClick = index => {
  const list = [...inputList];
  list.splice(index, 1);
  setInputList(list);
};

const handleComponentRemove = index => {
  const comp = [...components];
  comp.splice(index, 1);
  setComponents(comp);
};

const handleAddClick = () => {
  setInputList([...inputList, { courseOutcome: "n/a"}]);
};

const handleComponentAdd = () => {
  setComponents([...components, {name:"n/a",
    outcomes:[0],
    weight:0.0}])
};

const handleKey = (event, index) => {
	if(event.key === "Enter" && index === inputList.length-1){
		handleAddClick();
	}
};

const handleNameChange = (event, index) => {
  const comp = [...components];
  comp[index].name = event.target.value;
  setComponents(comp);
};

const handleTitleChange = (event) => {
  const { name, value } = event.target;
  const temp = {...titles};
	temp[name] = value;
  setTitles(temp);
};
const handleCreditChange = (event) =>{
  const newCredits = parseInt(event.target.value);
  setCredits(isNaN(newCredits)? 0 : newCredits);
};

    const newOutline = {description:"", courseName:"", courseCode:"",
                                        hours:"",
                                        credits:3,
                                        courseOutcomes:[""],
                                        components:[{
                                          name:"",
                                          outcomes:[0],
                                          weight:0.0
                                        }]};
    newOutline.description = titles.description;
    newOutline.hours = titles.hours;
    newOutline.credits = credits;
    newOutline.courseCode = titles.courseCode;
    newOutline.courseName = titles.courseName;
    newOutline.courseOutcomes = [inputList[0].courseOutcome];
    var i = 1;
    while (i < inputList.length) newOutline.courseOutcomes = [...newOutline.courseOutcomes, inputList[i++].courseOutcome];
    newOutline.components = [...components];

  return (
      <div className="box">
        <h5 className="title is-5">Course code:
        <input name="courseCode" onChange={handleTitleChange} />
        </h5>
        <h5 className="title is-5">Course name:
        <input name="courseName" style={{width: "400px"}} onChange={handleTitleChange} />
        </h5>
        <h5 className="title is-5">Course description:</h5>
        <TextField
          id="standard-multiline-flexible"
          multiline
          style={{width: "700px"}}
          margin="normal"
          name="description"
          rowsMax={4}
          value={titles.description}
          onChange={e=>handleTitleChange(e)}
        />
        <h6 className="title is-6">Course hours:
        <input
          name="hours"
          value={titles.hours}
          onChange={e=>handleTitleChange(e)}
          />
        </h6>
        <h6 className="title is-6">Course credits:
          <input onChange={handleCreditChange} value={credits} />
        </h6>
      	<h5 className="title is-5">Learning outcomes:</h5>
      	{inputList.map((x, i) => {
      		const label = "Outcome " + (i+1) + ":";
        	return (
          		<div>
          		<label>{label}
            	<input
            	style={{width: "500px"}}
              	name="courseOutcome"
              	value={x.courseOutcome}
	          	onChange={e => handleInputChange(e, i)}
	          	onKeyDown={e=>handleKey(e, i)}
            	/>
              	{inputList.length !== 1 && <button className="button is-small is-danger" onClick={()=>handleRemoveClick(i)}>Remove</button>}
              	{inputList.length - 1 === i && <button className="button is-small is-primary" onClick={handleAddClick}>Add</button>}
              	</label>
          		</div>
        	);
      	})}
      	{components.map((component, index1) => {
          return(
            <div className="component">
            <h6 className="title is-6">Component {index1+1} title:
            <input style={{width: "500px"}} value={components[index1].name} onChange={e=>handleNameChange(e, index1)} />
            </h6>
            <h6 className="title is-6">Outcomes evaluated for component {index1+1}:
            {inputList.map((x, index2) => {
              return (
                <FormControlLabel label={index2+1} control={<Checkbox  checked={components[index1].outcomes.includes(index2+1)} onChange={(e)=>handleRadioChange(e,index1,index2)} />} />
               );
            })}
            </h6>
             <h6 className="title is-6">Grading weight (percent): 
             <input name="assignment" style={{width: "100px"}}  onChange={e=>handleWeightChange(e, index1)} />
            </h6>
            {components.length !== 1 && <button className="button is-small is-danger" onClick={()=>handleComponentRemove(index1)}>Remove</button>}
            {components.length - 1 === index1 && <button className="button is-small is-primary" onClick={handleComponentAdd}>Add</button>}
            </div>
            );
        })}
        <div className="ConfirmBtn">
        <button className="button is-success" value={JSON.stringify(newOutline)} onClick={props.handler}>Submit</button>
        </div>
      </div>
  );
}
//Report form of outline
function OutlineForm(props){
  const outline = JSON.parse(props.value);
  const filename = outline.courseCode + "_" + outline.courseName + "_" + outline.created + ".pdf";
  return(
  <div className="box">
  <h5 className="title is-5">Course code: {outline.courseCode}</h5>
  <h5 className="title is-5">Course name: {outline.courseName}</h5>
  <h5 className="title is-5">Course description:</h5>
  <TextareaAutosize rowsMax={4} aria-label="maximum height" value={outline.description} />
  <h6 className="title is-6">Course hours: {outline.hours}</h6>
  <h6 className="title is-6">Course credits: {outline.credits}</h6>
  <h5 className="title is-5">After this course, students will be able to:</h5>
  {outline.courseOutcomes.map((outcome, index) => {
    const header = "" + (index + 1) + ". ";
    return (
      <div>
        {header + outcome}
      </div>
    );
  })}
  {outline.components.map((component, index) => {
    return (
    <div className="component">
      <h5 className="title is-5">Component {index+1}: {component.name}</h5>
      <h6 className="title is-6">Component covers outcomes: {component.outcomes.length > 0? component.outcomes.join() : "n/a"}</h6>
      <h6 className="title is-6">Component grading weight: {component.weight}</h6>
    </div>
    );
  })}
  <PDFViewer>
  <OutlineDoc value={props.value} />
  </PDFViewer>
  <LazyDownloadPDFButton name={filename} value={props.value} />
  </div>
  );
}

function App(){
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchors, setAnchors] = useState([null]);
  const [outlines, setOutlines] = useState([{description:"", courseName:"", courseCode:"",created:"",
                                        hours:"",
                                        credits:3,
                                        courseOutcomes:[""],
                                        components:[{
                                          name:"",
                                          outcomes:[0],
                                          weight:0.0
                                        }]}]);
  const addOutline = (event) =>{
    const newOutline = JSON.parse(event.target.value);
    const today = new Date();
    const dateform = today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
    newOutline.created = dateform;
    setOutlines([...outlines, newOutline]);
    setAnchors([...anchors, null])
  };

  const handleOpenForm = (event, index) => {
    const temp = [...anchors];
    temp[index] = event.currentTarget;
    setAnchors(temp);
  };

  const handleCloseForm = (index) => {
    const temp = [...anchors];
    temp[index] = null;
    setAnchors(temp);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  var ids = [undefined];
  var i = 1;
  while(i < anchors.length) ids = [...ids, Boolean(anchors[i++]) ? 'popover-' + i : undefined];
  var opens = [false];
  i = 1;
  while(i < anchors.length) opens = [...opens, Boolean(anchors[i++])];
  return (
    
    <div className="App">
      <Paper style={{maxHeight: 600, overflow: 'auto'}}>
        <List className="outlineList">
          {outlines.map((outline, index) => {
            const title = outline.courseCode + "_" + outline.courseName + "_" + outline.created;
            return (<ListItem button onClick={(e)=>handleOpenForm(e, index)}>
              {title}
            </ListItem>);
          })}
        </List>
      </Paper>
      <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Create new outline
      </Button>
      {outlines.map((outline, index) => {
        return(
          <Popover
        className="popup"
        id={ids[index]}
        open={opens[index]}
        anchorEl={anchors[index]}
        onClose={()=>handleCloseForm(index)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
      <OutlineForm value={JSON.stringify(outline)} />
      </Popover>
        );
      })}
      <Popover
        className="popup"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
      	<OutlineInputForm handler={addOutline} />
        
      </Popover>
    </div>
  );
}

export default App;
