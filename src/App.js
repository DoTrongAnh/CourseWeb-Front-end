import React, { useState } from "react";
import "./App.css";
import "bulma/css/bulma.css"
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Font, Page, Text, View, Document, StyleSheet, pdf, PDFViewer } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table';
import { saveAs } from 'file-saver';
import TimePicker from 'react-time-picker';
import fontBold from './font-roboto/Roboto-Bold.ttf';
import font from './font-roboto/Roboto-Regular.ttf';

Font.register({ family: 'Roboto', fonts: [
  {src: fontBold, fontWeight: 'bold'},
  {src: font}
  ] });



// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: "bold"
  },
  text: {
    fontFamily: 'Roboto'
  },
  underline : {
    textDecoration: 'underline',
    textDecorationStyle: 'solid',
  },
  cell: {
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    flexWrap: 'wrap'
},
  textRight:{
    fontFamily: 'Roboto',
    textAlign: "right"
  },
  table: {
    width: '100%',
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 12
},
tableRow:{
    display: 'flex',
    flexDirection: 'row',
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
  const grading = [{grade:"A+",range:[95.0,100.0]},
                    {grade:"A",range:[90.0,95.0]},
                    {grade:"A-",range:[85.0,90.0]},
                    {grade:"B+",range:[80.0,85.0]},
                    {grade:"B",range:[75.0,80.0]},
                    {grade:"B-",range:[70.0,75.0]},
                    {grade:"C+",range:[65.0,70.0]},
                    {grade:"C",range:[60.0,65.0]},
                    {grade:"C-",range:[56.0,60.0]},
                    {grade:"D+",range:[53.0,56.0]},
                    {grade:"D",range:[50.0,53.0]},
                    {grade:"F",range:[0.0,50.0]}];
  return (
  <Document>
    <Page size="A4" style={styles.page} >
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>1. Calendar Information{"\n"}</Text>
        <Text style={styles.text}>{outline.description + "\n"}Course hours:{outline.hours+"\n"}Course credits:{outline.credits+"\n"}</Text>
      </View>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>2. Learning Outcomes{"\n"}</Text>
        <Text style={styles.text}>At the end of this course, you will be able to:{"\n"}</Text>
        {outline.courseOutcomes.map((outcome, index) => {
          const header = "" + (index + 1) + ". ";
          return (
           <Text style={styles.text}>
              {header + outcome.courseOutcome + "\n"}
            </Text>
          );
        })}
      </View>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>3. Timetable{"\n"}</Text>
        <Table data={outline.sections}>
        <TableHeader textAlign={"center"}>
        <TableCell style={styles.title}>Section</TableCell>
        <TableCell style={styles.title}>Day(s) of the week</TableCell>
        <TableCell style={styles.title}>Time</TableCell>
        <TableCell style={styles.title}>Location</TableCell>
        </TableHeader>
        <TableBody textAlign={"center"}>
        <DataTableCell getContent={(r)=>r.name} />
        <DataTableCell getContent={(r)=>r.days.length > 0? r.days.join() : "n/a"} />
        <DataTableCell getContent={(r)=>(r.timestart + " - " +  r.timeend)} />
        <DataTableCell getContent={(r)=>r.location} />
        </TableBody>
        </Table>
      </View>
      <View style={styles.section} wrap={false}>
      <Text style={styles.title}>4. Course Instructors{"\n"}</Text>
      {outline.instructors.filter((prof)=>{return prof.role === "instructor";}).length > 0 &&
      (<View><Text style={[styles.text, styles.underline]}>Course Instructor{"\n"}</Text>
        <Table data={outline.instructors.filter((prof)=>{return prof.role === "instructor";})} >
          <TableHeader textAlign={"center"}>
          <TableCell style={styles.title}>Section</TableCell>
          <TableCell style={styles.title}>First Name</TableCell>
          <TableCell style={styles.title}>Family Name</TableCell>
          <TableCell style={styles.title}>Phone</TableCell>
          <TableCell style={styles.title}>Office</TableCell>
          <TableCell style={styles.title}>Email</TableCell>
          </TableHeader>
          <TableBody textAlign={"center"}>
          <DataTableCell getContent={(r)=>r.section} />
          <DataTableCell getContent={(r)=>r.fname} />
          <DataTableCell getContent={(r)=>r.lname} />
          <DataTableCell getContent={(r)=>r.phone} />
          <DataTableCell getContent={(r)=>r.office} />
          <DataTableCell getContent={(r)=>r.email} />
          </TableBody>
        </Table></View>
        )}
      {outline.instructors.filter((prof)=>{return prof.role === "coordinator";}).length > 0 &&
      (<View><Text style={[styles.text, styles.underline]}>Course Coordinator{"\n"}</Text>
        <Table data={outline.instructors.filter((prof)=>{return prof.role === "coordinator";})} >
          <TableHeader textAlign={"center"}>
          <TableCell style={styles.title}>Section</TableCell>
          <TableCell style={styles.title}>First Name</TableCell>
          <TableCell style={styles.title}>Family Name</TableCell>
          <TableCell style={styles.title}>Phone</TableCell>
          <TableCell style={styles.title}>Office</TableCell>
          <TableCell style={styles.title}>Email</TableCell>
          </TableHeader>
          <TableBody textAlign={"center"}>
          <DataTableCell getContent={(r)=>r.section} />
          <DataTableCell getContent={(r)=>r.fname} />
          <DataTableCell getContent={(r)=>r.lname} />
          <DataTableCell getContent={(r)=>r.phone} />
          <DataTableCell getContent={(r)=>r.office} />
          <DataTableCell getContent={(r)=>r.email} />
          </TableBody>
        </Table></View>
        )}
      {outline.instructors.filter((prof)=>{return prof.role === "ta";}).length > 0 &&
      (<View><Text style={[styles.text, styles.underline]}>Course TA{"\n"}</Text>
        <Table data={outline.instructors.filter((prof)=>{return prof.role === "ta";})} >
          <TableHeader textAlign={"center"}>
          <TableCell style={styles.title}>Section</TableCell>
          <TableCell style={styles.title}>First Name</TableCell>
          <TableCell style={styles.title}>Family Name</TableCell>
          <TableCell style={styles.title}>Phone</TableCell>
          <TableCell style={styles.title}>Office</TableCell>
          <TableCell style={styles.title}>Email</TableCell>
          </TableHeader>
          <TableBody textAlign={"center"}>
          <DataTableCell getContent={(r)=>r.section} />
          <DataTableCell getContent={(r)=>r.fname} />
          <DataTableCell getContent={(r)=>r.lname} />
          <DataTableCell getContent={(r)=>r.phone} />
          <DataTableCell getContent={(r)=>r.office} />
          <DataTableCell getContent={(r)=>r.email} />
          </TableBody>
        </Table></View>
        )}
      </View>
      <View style={styles.section} wrap={false}>
      <Text style={styles.title}>5. Examinations{"\n"}</Text>
      <Text style={styles.text}>{outline.exam + "\n"}</Text>
      </View>
      <View style={styles.section} wrap={false}>
      <Text style={styles.title}>6. Use of Calculators in Examinations{"\n"}</Text>
      <Text style={styles.text}>Calculators are{outline.calculator? " " : " not "}allowed during examinations.{"\n"}</Text>
      </View>
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>7. Final Grade Determination{"\n"}</Text>
        <Table data={components}>
        <TableHeader style={styles.tableRow} textAlign={"center"}>
        <TableCell style={styles.title}>
        Components
        </TableCell>
        <TableCell style={styles.title}>
        Learning outcome(s) evaluated
        </TableCell>
        <TableCell style={styles.title}>
        Weight
        </TableCell>
        </TableHeader>
        <TableBody textAlign={"center"}>
        <DataTableCell getContent={(r)=>(<Text>{r.name}</Text>)} />
        <DataTableCell getContent={(r)=>(<Text>{r.outcomes}</Text>)} />
        <DataTableCell getContent={(r)=>(<Text>{r.weight + "%"}</Text>)} />
        </TableBody>
        </Table>
        <Text style={styles.textRight} >Total:{components.reduce((count, comp)=>{return count+comp.weight;},0)+"%"}</Text>
        <Text style={styles.text}>Note:{"\n\n"}
        a) You must either achieve at least 50% on the final exam or achieve at least 50% on the weighted average of the midterm and final exam. You must also achieve an average of at least 50% on the lab section of the course. If you do not satisfy these caveats, you will not receive a passing grade.{"\n\n"}
        b) Circumstances beyond one’s control (e.g. sickness, etc.), leading to missing lab session and/or delays in assignment submissions should be discussed with the course instructor as soon as possible. Proper documentation must be provided.{"\n\n"}
        c) Conversion from a score out of 100 to a letter grade will be done using the conversion chart shown below. This grading scale can only be changed during the term if the grades will not be lowered.{"\n\n"}
        </Text>
        <Table data={grading}>
        <TableHeader style={styles.tableRow} textAlign={"center"}>
        <TableCell style={styles.title}>Letter Grade</TableCell>
        <TableCell style={styles.title}>Total Mark (T)</TableCell>
        </TableHeader>
        <TableBody textAlign={"center"}>
        <DataTableCell getContent={(r)=>(<Text style={styles.text}>{r.grade}</Text>)} />
        <DataTableCell getContent={(r)=>(<Text style={styles.text}>{r.range[0] + " \u2264 T \u2264 " + r.range[1]}</Text>)} />
        </TableBody>
        </Table>
      </View>
      <View style={styles.section} wrap={false}>
      <Text style={styles.title}>8. Textbooks{"\n"}</Text>
      {outline.textbooks.filter((book)=>{return book.required===true;}).length > 0 &&
      (<View><Text style={styles.underline}>The following textbook(s) is required for this course{"\n\n"}</Text>
        {outline.textbooks.filter((book)=>{return book.required===true;}).map((book,identity)=>{
                  const tableContent=[{header:"Title",content:book.title},
                                      {header:"Author(s)",content:book.author},
                                      {header:"Edition, Year",content:book.editionYear},
                                      {header:"Publisher",content:book.publisher}];
                  return (
                  <Table data={tableContent}>
                    <TableBody textAlign={"left"}>
                    <DataTableCell style={styles.title} getContent={(r)=>r.header} />
                    <DataTableCell getContent={(r)=>r.content} />
                    </TableBody>
                  </Table>
                  );
                })}</View>)}
        {outline.textbooks.filter((book)=>{return book.required===false;}).length > 0 &&
      (<View><Text style={styles.underline}>The following textbook(s) is recommended for this course{"\n\n"}</Text>
        {outline.textbooks.filter((book)=>{return book.required===false;}).map((book,identity)=>{
                  const tableContent=[{header:"Title",content:book.title},
                                      {header:"Author(s)",content:book.author},
                                      {header:"Edition, Year",content:book.editionYear},
                                      {header:"Publisher",content:book.publisher}];
                  return (
                  <Table data={tableContent}>
                    <TableBody textAlign={"left"}>
                    <DataTableCell style={styles.title} getContent={(r)=>r.header} />
                    <DataTableCell getContent={(r)=>r.content} />
                    </TableBody>
                  </Table>
                  );
                })}</View>)}
      </View>
      <View style={styles.section} wrap={false}>
      <Text style={styles.title}>9. Course Policies{"\n\n"}</Text>
      <Text style={[styles.text, styles.underline]}>Advising Syllabus{"\n\n"}
      </Text>
      <Text style={styles.text}>All Schulich School of Engineering students and instructors have a responsibility to familiarize themselves with the policies described in the Schulich School of Engineering Advising Syllabus available at:{"\n"}{"http://"}schulich.ucalgary.ca/undergraduate/advising 
      {"\n\n"}</Text>
      <Text style={[styles.text, styles.underline]}>Emergency Evacuation/Assembly Points{"\n\n"}
      </Text>
      <Text style={styles.text}>
      In the event of an alarm sounding, all classrooms and labs must be evacuated immediately.  Please respond to alarms promptly by leaving the building by the closest available exit.  Faculty and students must remain outside the building until the 'all clear' has been given by a Fire Marshall. In case of emergency, call 220-5333.{"\n"}Assembly Points have been identified across campus. These areas have been selected as they are large enough to hold a significant number of people and will provide an evacuated population access to washroom facilities and protection from the elements. More information on assembly points can be found at {"\n"}{"http://"}www.ucalgary.ca/emergencyplan/assemblypoints.
      {"\n\n"}</Text>
      <Text style={[styles.text, styles.underline]}>WELLNESS AND MENTAL HEALTH RESOURCES{"\n\n"}
      </Text>
      <Text style={styles.text}>The University of Calgary recognizes the pivotal role that student mental health plays in physical health, social connectedness and academic success, and aspires to create a caring and supportive campus community where individuals can freely talk about mental health and receive supports when needed. We encourage you to explore the mental health resources available throughout the university community, such as counselling, self-help resources, peer support or skills-building available through the SU Wellness Centre (Room 370, MacEwan Student Centre, {"https://"}www.ucalgary.ca/wellnesscentre/services/mental-health-services) and the Campus Mental Health Strategy website ({"http://"}www.ucalgary.ca/mentalhealth/).
      </Text>
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
  
  const [inputList, setInputList] = useState([{ courseOutcome: "n/a",attribute:"A1",level:"I"}]);
  const [titles, setTitles] = useState({
                              description: "n/a",
                              hours: "n/a",
                              courseName:"n/a",
                              courseCode:"n/a", exam:"n/a"});
  const [components, setComponents] = useState([{
    name:"n/a",
    outcomes:[0],
    weight:0.0
  }]);
  const [lab, setLab] = useState({type:"",number:0,safetyTaught:false,safetyExamined:false});
  const [category, setCategory] = useState({math:0.0,naturalScience:0.0,complementary:0.0,engineerScience:0.0,engineerDesign:0.0});
  const [credits, setCredits] = useState(3);
  const [calculator, setCalculator] = useState(false);
  const [sections, setSections] = useState([{name:"n/a",days:[],timestart:"n/a",timeend:"n/a",location:"n/a",type:"n/a",studentPerSupervisor:""}]);
  const [instructors, setInstructors] = useState([{role:"",fname:"",lname:"",phone:"",office:"",email:"",section:""}]);
  const [textbooks, setTextbooks] = useState([{title:"",author:"",editionYear:"",publisher:"",required:undefined}]);
const handleCalulator = (event) => {
  setCalculator(event.target.checked);
};

const handleTextbooks = (event, index) => {
  const temp = [...textbooks];
  const {name, value} = event.target;
  if(name === "required") temp[index][name] = event.target.checked;
  else temp[index][name] = value;
  setTextbooks(temp);
};

const removeTextbook = (index) =>{
  const temp = [...textbooks];
  temp.splice(index, 1);
  setTextbooks(temp);
};

const addTextbook = () =>{
  setTextbooks([...textbooks, {title:"",author:"",editionYear:"",publisher:"",required:undefined}])
}

const handleLabChange = (event) =>{
  const {name, value} = event.target;
  const temp = {...lab};
  if(name === "number"){
    const num = parseInt(value);
    temp[name] = isNaN(num)? 0 : num;
  }
  else temp[name] = value;
  setLab(temp);
};

const handleInstructors = (event, index) => {
  const temp = [...instructors];
  const {name, value} = event.target;
  temp[index][name] = value;
  setInstructors(temp);
};

const removeInstructor = (index) =>{
  const temp = [...instructors];
  temp.splice(index, 1);
  setInstructors(temp);
};

const addInstructor = () =>{
  setInstructors([...instructors, {fname:"",lname:"",phone:"",office:"",email:"",section:""}])
}
const handleSectionStart = (event, index) =>{
  const temp = [...sections];
  temp[index].timestart = event;
  setSections(temp);
};
const handleSectionEnd = (event, index) =>{
  const temp = [...sections];
  temp[index].timeend = event;
  setSections(temp);
};

const handleSection = (event, index) =>{
  const temp = [...sections];
  temp[index][event.target.name] = event.target.value;
  setSections(temp);
};
const handleSectionDay = (event, index) =>{
  const temp = [...sections];
  if(event.target.checked) temp[index].days = [...new Set([...temp[index].days, event.target.name])];
  else{
    const id = temp[index].days.indexOf(event.target.name);
    if(id >=0) temp[index].days.splice(id, 1);
  }
  setSections(temp);
};
const addSection = () =>{
 setSections([...sections, {name:"n/a",days:[],timestart:"n/a",timeend:"n/a",location:"n/a"}]);
};

const removeSection = (index) =>{
  const temp = [...sections];
  temp.splice(index, 1);
  setSections(temp);
};

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
  setInputList([...inputList, { courseOutcome: "n/a",attribute:"A1",level:"I"}]);
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

const handleCategoryChange = (event) =>{
  const temp = {...category};
  const num = parseFloat(event.target.value);
  temp[event.target.name] = isNaN(num)? 0.0 : num;
  setCategory(temp);
}

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
                                        courseOutcomes:[],
                                        AU:[],
                                        sections:[],
                                        lab:[],
                                        textbooks:[],
                                        exam:"",
                                        calculator:false,
                                        instructors:[],
                                        components:[{
                                          name:"",
                                          outcomes:[0],
                                          weight:0.0
                                        }]};
    newOutline.description = titles.description;
    newOutline.hours = titles.hours;
    newOutline.credits = credits;
    newOutline.exam = titles.exam;
    newOutline.instructors = [...instructors];
    newOutline.courseCode = titles.courseCode;
    newOutline.courseName = titles.courseName;
    newOutline.courseOutcomes = [...inputList];
    newOutline.AU = {...category};
    newOutline.lab = {...lab};
    newOutline.calculator = calculator;
    newOutline.sections = [...sections];
    newOutline.components = [...components];
    var temporary = [...textbooks];
    for(var a = 0; a < temporary.length; a++)
      if(temporary[a].required === undefined) temporary.splice(a--, 1);
    newOutline.textbooks = [...temporary];
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
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
              <InputLabel>Graduation attribute:
              <Select value={x.attribute} name="attribute" onChange={e=> handleInputChange(e, i)}>
              <MenuItem value={'A1'}>A1. A knowledge base for engineering</MenuItem>
              <MenuItem value={'A2'}>A2. Problem analysis</MenuItem>
              <MenuItem value={'A3'}>A3. Investigation</MenuItem>
              <MenuItem value={'A4'}>A4. Design</MenuItem>
              <MenuItem value={'A5'}>A5. Use of engineering tools</MenuItem>
              <MenuItem value={'A6'}>A6. Individual and team work</MenuItem>
              <MenuItem value={'A7'}>A7. Communication skills</MenuItem>
              <MenuItem value={'A8'}>A8. Professionalism</MenuItem>
              <MenuItem value={'A9'}>A9. Impact of engineering on society/environment</MenuItem>
              <MenuItem value={'A10'}>A10. Ethics and equity</MenuItem>
              <MenuItem value={'A11'}>A11. Economics and project management</MenuItem>
              <MenuItem value={'A12'}>A12. Life-long learning</MenuItem>
              </Select>
              </InputLabel>
              <InputLabel>Instruction level:
              <Select value={x.level} name="level" onChange={e=> handleInputChange(e, i)}>
              <MenuItem value={"I"}>Introductory level</MenuItem>
              <MenuItem value={"D"}>Intermediate development level</MenuItem>
              <MenuItem value={"A"}>Advanced application level</MenuItem>
              </Select>
              </InputLabel>
              	{inputList.length !== 1 && <button className="button is-small is-danger" onClick={()=>handleRemoveClick(i)}>Remove</button>}
              	{inputList.length - 1 === i && <button className="button is-small is-primary" onClick={handleAddClick}>Add</button>}
              	</label>
          		</div>
        	);
      	})}
        <h5 className="title is-5">Course section(s):</h5>
        {sections.map((section, index) => {
          return (
          <div className="section">
          <h6 className="title is-6">Section {index+1}:<input name="name" onChange={(e)=>handleSection(e,index)} /></h6>
          <h6 className="title is-6">Day(s) of the week
          {days.map((day) => {
                      return(
                      <FormControlLabel label={day} control={<Checkbox name={day}  checked={sections[index].days.includes(day)} onChange={(e)=>handleSectionDay(e,index)} />} />
                      );
                    })}
          </h6>
          <h6 className="title is-6">Location:<input name="location" onChange={(e)=>handleSection(e,index)} /></h6>
          <h6 className="title is-6">Time start:<TimePicker name="timestart" onChange={(e)=>handleSectionStart(e,index)} /></h6>
          <h6 className="title is-6">Time end:<TimePicker name="timeend" onChange={(e)=>handleSectionEnd(e,index)} /></h6>
          <h6 className="title is-6">Section type:<Select name="type" onChange={(e)=>handleSection(e,index)}>
          <MenuItem value={"lecture"}>Lecture</MenuItem>
          <MenuItem value={"tutorial"}>Tutorial</MenuItem>
          <MenuItem value={"lab"}>Lab</MenuItem>
          </Select></h6>
          <h6 className="title is-6">Students to Supervisor:<input name="studentPerSupervisor" onChange={(e)=>handleSection(e,index)} /></h6>
          {sections.length !== 1 && <button className="button is-small is-danger" onClick={()=>removeSection(index)}>Remove</button>}
          {sections.length - 1 === index && <button className="button is-small is-primary" onClick={addSection}>Add</button>}
          </div>);
        })}
        <h5 className="title is-5">Course categories accreditation unit:</h5>
        <label>Math:<input name="math" onChange={handleCategoryChange}/></label>
        <label>Natural Science:<input name="naturalScience" onChange={handleCategoryChange}/></label>
        <label>Complementary Studies:<input name="complementary" onChange={handleCategoryChange}/></label>
        <label>Engineering Science:<input name="engineerScience" onChange={handleCategoryChange}/></label>
        <label>Engineering Design:<input name="engineerDesign" onChange={handleCategoryChange}/></label>
        <h5 className="title is-5">Lab experience:</h5>
        <label>Lab Type:<input name="type" onChange={handleLabChange} /></label>
        <label>Number of Labs:<input name="number" onChange={handleLabChange} /></label>
        <label>Lab Safety Taught?<Select name="safetyTaught" onChange={handleLabChange}>
        <MenuItem value={true}>Yes</MenuItem>
        <MenuItem value={false}>No</MenuItem>
        </Select></label>
        <label>Lab Safety Examined?<Select name="safetyExamined" onChange={handleLabChange}>
        <MenuItem value={true}>Yes</MenuItem>
        <MenuItem value={false}>No</MenuItem>
        </Select></label>
        <h5 className="title is-5">Course instructors:</h5>
        {instructors.map((prof, index) => {
          return (
            <div className="instructor">
            <label>Instructor first name:<input name="fname" value={prof.fname} onChange={(e)=>handleInstructors(e,index)} /></label>
            <label>Family name:<input name="lname" value={prof.lname} onChange={(e)=>handleInstructors(e,index)} /></label>
            <label>Phone:<input name="phone" value={prof.phone} onChange={(e)=>handleInstructors(e,index)} /></label>
            <label>Office:<input name="office" value={prof.office} onChange={(e)=>handleInstructors(e,index)} /></label>
            <label>Email:<input name="email" value={prof.email} onChange={(e)=>handleInstructors(e,index)} /></label>
            <label>Role:<Select name="role" onChange={(e)=>handleInstructors(e,index)}>
            <MenuItem value="instructor">Instructor</MenuItem>
            <MenuItem value="coordinator">Course Coordinator</MenuItem>
            <MenuItem value="ta">TA</MenuItem>
            </Select></label>
            <label>Section:<Select name="section" onChange={(e)=>handleInstructors(e,index)}>
            {sections.map((section) => (<MenuItem value={section.name}>{section.name}</MenuItem>))}
            </Select></label>
            {instructors.length !== 1 && <button className="button is-small is-danger" onClick={()=>removeInstructor(index)}>Remove</button>}
            {instructors.length - 1 === index && <button className="button is-small is-primary" onClick={addInstructor}>Add</button>}
            </div>
            );
        })}
        <h5 className="title is-5">Examinations:</h5>
        <TextField
          id="standard-multiline-flexible"
          multiline
          style={{width: "700px"}}
          margin="normal"
          name="exam"
          rowsMax={4}
          value={titles.exam}
          onChange={e=>handleTitleChange(e)}
        />
        <h6 className="title is-6">Examinations:<Checkbox checked={calculator} onChange={handleCalulator} /></h6>
        <h5 className="title is-5">Course component(s):</h5>
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
        <h5 className="title is-5">Textbooks:</h5>
        {textbooks.map((book, index) => {
          return(
          <div className="textbook">
          <label>Title:<input name="title" onChange={e=>handleTextbooks(e,index)} /></label>
          <label>Author(s):<input name="author" onChange={e=>handleTextbooks(e,index)} /></label>
          <label>Edition, Year:<input name="editionYear" onChange={e=>handleTextbooks(e,index)} /></label>
          <label>Publisher:<input name="publisher" onChange={e=>handleTextbooks(e,index)} /></label>
          <label>Required?<Checkbox name="required" onChange={e=>handleTextbooks(e,index)} /></label>
          {textbooks.length !== 1 && <button className="button is-small is-danger" onClick={()=>removeTextbook(index)}>Remove</button>}
          {textbooks.length - 1 === index && <button className="button is-small is-primary" onClick={addTextbook}>Add</button>}
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
  <TextareaAutosize rowsMin={4} aria-label="minimum height" value={outline.description} />
  <h6 className="title is-6">Course hours: {outline.hours}</h6>
  <h6 className="title is-6">Course credits: {outline.credits}</h6>
  <h5 className="title is-5">After this course, students will be able to:</h5>
  {outline.courseOutcomes.map((outcome, index) => {
    const header = "" + (index + 1) + ". ";
    const extra = "[" + outcome.attribute + "/" + outcome.level +"]";
    return (
      <div>
        {header + outcome.courseOutcome + extra}
      </div>
    );
  })}
  <h5 className="title is-5">Course content Category:</h5>
  <label>Math:{outline.AU.math + "%\t"}Natural Science:{outline.AU.naturalScience + "%\n"}
  Complementary Studies:{outline.AU.complementary + "%\t"}Engineering Science:{outline.AU.engineerScience + "%\n"}
  Engineering Design:{outline.AU.engineerDesign + "%"}</label>
  {outline.lab.number >= 0 && 
    <div className="lab">
    <h6 className="title is-6">Lab Type:{outline.lab.type}</h6>
    <h6 className="title is-6">Number of labs:{outline.lab.number}</h6>
    <h6 className="title is-6">Lab Safety Taught?{outline.lab.safetyTaught? "YES" : "NO"}</h6>
    <h6 className="title is-6">Lab Safety Examined?{outline.lab.safetyExamined? "YES" : "NO"}</h6>
    </div>}
  {outline.sections.map((section, index) => {
    return (
      <div className="section">
        <h5 className="title is-5">Section {index+1}: {section.name}</h5>
        <h6 className="title is-6">Weekly schedule: {section.days.length >= 0? section.days.join() : "n/a"}</h6>
        <h6 className="title is-6">Time: {section.timestart + " - " + section.timeend}</h6>
        <h6 className="title is-6">Location: {section.location}</h6>
        <h6 className="title is-6">Section type: {section.type}</h6>
        <h6 className="title is-6">Students per Supervisor: {section.studentPerSupervisor}</h6>
      </div>
      );
  })}
  {outline.instructors.map((prof, index) => {
    return (
    <div className="instructor">
    <h5 className="title is-5">Instructor {index+1}: {prof.fname + " " + prof.lname}</h5>
    <h6 className="title is-6">Phone: {prof.phone}</h6>
    <h6 className="title is-6">Office: {prof.office}</h6>
    <h6 className="title is-6">Email: {prof.email}</h6>
    <h6 className="title is-6">Role: {prof.role}</h6>
    <h6 className="title is-6">Assigned to section: {prof.section}</h6>
    </div>
    );
  })}
  <h5 className="title is-5">Course examinations:</h5>
  <TextareaAutosize rowsMin={4} aria-label="minimum height" value={outline.exam} />
  <h6 className="title is-6">Use of calculator allowed:{" " + outline.calculator? "YES" : "NO"}</h6>
  {outline.components.map((component, index) => {
    return (
    <div className="component">
      <h5 className="title is-5">Component {index+1}: {component.name}</h5>
      <h6 className="title is-6">Component covers outcomes: {component.outcomes.length > 0? component.outcomes.join() : "n/a"}</h6>
      <h6 className="title is-6">Component grading weight: {component.weight}</h6>
    </div>
    );
  })}
  {outline.textbooks.map((textbook, index) => {
    return (
    <div className="textbook">
    <h5 className="title is-5">Textbook {index+1}: {textbook.title}</h5>
    <h6 className="title is-6">Author(s): {textbook.author}</h6>
    <h6 className="title is-6">Edition, Year: {textbook.editionYear}</h6>
    <h6 className="title is-6">Publisher: {textbook.published}</h6>
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
