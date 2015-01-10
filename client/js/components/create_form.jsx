var React = require("react");
var _ = require("lodash");
var $ = require("jquery");
var router;
var AppStore = require("../store/app_store");

var CreateForm = React.createClass ({
  componentWillMount: function() {
    router = this.props.router;
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this.forceUpdate);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.forceUpdate);
  },

  trigger: function(){
    this.forceUpdate();
  },

  createFormSchema: function(event) {
    event.preventDefault();
    var schemaName = AppStore.formTitle.split(" ").join("_");
    var URL = "/api/schema" + schemaName;
    var DATA = {};
    AppStore.questionsInEdit.map(function(elem){
      DATA[elem[2]]=elem;
    });
    $.ajax({
      url: URL,
      type:"PUT",
      data: DATA,
      success: function(data) {
        router.navigate("/", {trigger: true});
        AppStore.emitChange();
      },
      error: function(error) {
        console.error(error);
      }
    });
  },

  createNewQuestion: function(event) {
    event.preventDefault();
    var index = AppStore.questionsInEdit.length;
    var questionObject = [];
    questionObject.push(index);
    questionObject.push("draggableQuestionInactive");
    for(var i=0; i < event.target.length; i++){
      questionObject.push(event.target[i].value);
    }
    AppStore.questionsInEdit.push(questionObject);
    this.trigger();
  },

  getSupportingFormFields: function() {
    AppStore.currentQuestionType=[this.refs.questionType.getDOMNode().value];
    this.trigger();
  },

  changeFormTitle: function() {
    AppStore.formTitle = this.refs.formTitle.getDOMNode().value;
    this.trigger();
  },

  outputUpdate: function(id) {
    document.querySelector("#output"+id).value = this.refs["scale"+id].getDOMNode().value;
  },

  drop: function(questionIndex) {
    event.preventDefault();
    var targetIndex = AppStore.questionDropTarget = questionIndex; 
    var movingIndex = AppStore.questionBeingDragged; 
    var swap;   
    this.toggleQuestionActive(questionIndex);    
    AppStore.questionsInEdit[AppStore.questionBeingDragged][0]=questionIndex;         
    AppStore.questionsInEdit[targetIndex][0]=movingIndex;
    swap = AppStore.questionsInEdit[movingIndex];
    AppStore.questionsInEdit[movingIndex]=AppStore.questionsInEdit[targetIndex];
    AppStore.questionsInEdit[targetIndex] = swap;
    this.trigger();
  },

  dragStart: function(questionIndex) {
    AppStore.questionBeingDragged = questionIndex;
  },

  preventDefault: function(event) {
    event.preventDefault();
  },

  toggleQuestionActive: function(questionIndex) {
    var question = AppStore.questionsInEdit[questionIndex];
    if(questionIndex !== AppStore.questionBeingDragged){
      if(question[1] === "draggableQuestionActive"){
        AppStore.questionsInEdit[questionIndex][1] = "draggableQuestionInactive";
      }else{
        AppStore.questionsInEdit[questionIndex][1] = "draggableQuestionActive";
      }
    }
    this.trigger();
  },

  render: function() {
    return (
      <div>
      <div id="left-side">
        <div id="editableQuestions">
        <br/>
        Form Title: <input placeholder="Example Form Title"  
                    onChange={this.changeFormTitle}ref="formTitle" 
                    type="text"/>
          {AppStore.questionsInEdit.map(function(question) {
            var questionIndex = question[0];
            var questionActive = question[1];
            var questionTitle = question[2];
            var questionType = question[3];
            switch(questionType) {
              case "text": 
                  return <div id={questionActive} 
                          draggable="true" 
                          onDragStart={this.dragStart.bind(this, questionIndex)} 
                          onDragEnter={this.toggleQuestionActive.bind(this, questionIndex)} 
                          onDragLeave={this.toggleQuestionActive.bind(this, questionIndex)} 
                          onDragOver={this.preventDefault}
                          onDrop={this.drop.bind(this, questionIndex)}>
                    <div id="qTitle">{questionTitle}</div>
                        <input type="text" value="answer goes here" readOnly="true"/>
                    </div>;
                  

              case "scale":
                return <div id={questionActive} 
                        draggable="true" 
                        onDragStart={this.dragStart.bind(this, questionIndex)} 
                        onDragEnter={this.toggleQuestionActive.bind(this, questionIndex)} 
                        onDragLeave={this.toggleQuestionActive.bind(this, questionIndex)} 
                        onDragOver={this.preventDefault}
                        onDrop={this.drop.bind(this, questionIndex)}>
                    <div id="qTitle">{questionTitle}</div>
                    Min: <input type="number" 
                          name="minInput" 
                          defaultValue={question[4]}/><br/>
                    Max: <input type="number" 
                          name="maxInput" 
                          defaultValue={question[5]}/><br/>
                    Labels (optional): <input type="text" 
                                      placeholder="min label" 
                                      name="minLabel" 
                                      defaultValue={question[6]}/>
                                      <input type="text" 
                                      placeholder="max label" 
                                      name="maxLabel" 
                                      defaultValue={question[7]}/><br/>
                  </div>;         
            }
          }, this)}
        </div>
        <div id="createNewQuestion">
          <form onSubmit={this.createNewQuestion}> 
            Question Title: <input ref="questionTitle" 
                            type="text"/>
            <div>
            Question Type:  <select defaultValue="text" 
                            onChange={this.getSupportingFormFields} 
                            ref="questionType">
                              <option value="text">Text</option>
                              <option value="scale">Scale</option>
                              <option value="number">Number</option>
                            </select>
            </div>
            <div id="SupportingFormFields">
             {AppStore.currentQuestionType.map(function(questionType){
              switch(questionType) {
                case "text": 
                    return <div>
                        <input type="text" 
                        value="answer goes here" 
                        readOnly="true"/>
                    </div>;
                    
                    
                case "scale": 
                  return <div>
                            Min: <input type="number" 
                                  name="minInput"/><br/>
                            Max: <input type="number" 
                                  name="maxInput"/><br/>
                            Labels (optional): <input type="text" 
                                                placeholder="min label" 
                                                name="minLabel"/>
                                                <input type="text" 
                                                placeholder="max label" 
                                                name="maxLabel"/><br/>
                          </div>;
                  
                  
              }
            })
          }</div>
            <button type="submit" className="addField">Add Item</button>
          </form>

        </div>
    </div>
    <div id="sampleFormDivider">
      <div id="liveRenderSampleForm">
        <div id="formTitle">{AppStore.formTitle}</div>
       {AppStore.questionsInEdit.map(function(question) {
          var questionIndex = question[0];
          var questionActive = question[1];
          var questionTitle = question[2];
          var questionType = question[3];

          switch(questionType) {
                case "text": 
                  return <div>
                          {questionTitle}<br/>
                          <input type="text" value="" readOnly="true"/>
                          <br/>
                        </div>;
       
                case "scale": 
                  return <div>
                           {questionTitle}<br/>
                           <output for={"scale"+questionIndex} 
                           id={"output"+questionIndex}>5</output><br/>
                            <label for={"scale"+questionIndex}>{question[4]}</label>
                            <input ref={"scale"+questionIndex} type="range"
                              min={question[4]}
                              max={question[5]}
                              id={"scale"+questionIndex}
                              onChange={this.outputUpdate.bind(this, question[0])}/>
                            <label for={"scale"+questionIndex}>{question[5]}</label>
                            <div>{question[6]}    {question[7]}  </div>
                              
                          </div>;         
          }
        }, this)}
      <button onClick={this.createFormSchema} className="completeForm">Publish Form</button>
      </div>
    </div>
  </div>
  );}
});

module.exports = CreateForm;
