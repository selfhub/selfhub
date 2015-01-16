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
    var URL = "/api/schema/" + schemaName;
    var DATA = {};
    DATA.name = schemaName;
    DATA.metaData = {randomInfo: "no metaData here"};
    DATA.data = {};
    AppStore.questionsInEdit.map(function(elem) {
      var questionTitle = elem[2].split(" ").join("_");
      DATA.data[questionTitle] = elem;
    });
    $.ajax({
      url: URL,
      type:"PUT",
      data: DATA,
      beforeSend: function(request) {
        request.setRequestHeader("x-jwt", localStorage.getItem("token"));
      },
      success: function(data) {
        console.log("Successful PUT request");
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
    for(var i = 0; i < event.target.length; i++){
      questionObject.push(event.target[i].value);
    }
    AppStore.questionsInEdit.push(questionObject);
    this.trigger();
  },

  getSupportingFormFields: function() {
    AppStore.currentQuestionType = [this.refs.questionType.getDOMNode().value];
    this.trigger();
  },

  changeFormTitle: function() {
    AppStore.formTitle = this.refs.formTitle.getDOMNode().value;
    this.trigger();
  },

  outputUpdate: function(id) {
    document.querySelector("#output" + id).value = this.refs["scale" + id].getDOMNode().value;
  },

  drop: function(questionIndex) {
    event.preventDefault();
    var targetIndex = AppStore.questionDropTarget = questionIndex;
    var movingIndex = AppStore.questionBeingDragged;
    var swap;
    this.toggleQuestionActive(questionIndex);
    AppStore.questionsInEdit[AppStore.questionBeingDragged][0] = questionIndex;
    AppStore.questionsInEdit[targetIndex][0] = movingIndex;
    swap = AppStore.questionsInEdit[movingIndex];
    AppStore.questionsInEdit[movingIndex] = AppStore.questionsInEdit[targetIndex];
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
    if(questionIndex !== AppStore.questionBeingDragged) {
      if(question[1] === "draggableQuestionActive") {
        AppStore.questionsInEdit[questionIndex][1] = "draggableQuestionInactive";
      } else {
        AppStore.questionsInEdit[questionIndex][1] = "draggableQuestionActive";
      }
    }
    this.trigger();
  },

  render: function() {
    return (
      <div className="form-creation-page">
        <div id="left-side">
          <div id="create-new-question">
            <section className="section-block">
              <div className="form-header">
                <p className="form-label">Schema Name: </p>
                <input className="form-input" placeholder="give your schema a name"
                  onChange={this.changeFormTitle} ref="formTitle"
                  type="text"/>
              </div>
              <form onSubmit={this.createNewQuestion}>
                <div className="form-header">
                  <p className="form-label">Table Header: </p>
                  <input className="form-input" ref="questionTitle"
                    placeholder="add a new table header" type="text"/>
                </div>
                <div>
                  <p className="form-label">Data Type: </p>
                  <select defaultValue="text"
                    onChange={this.getSupportingFormFields}
                    ref="questionType">
                    <option value="text">Text</option>
                    <option value="scale">Scale</option>
                    <option value="number">Number</option>
                  </select>
                </div>
                <div id="supporting-form-fields">
                {AppStore.currentQuestionType.map(function(questionType) {
                  switch(questionType) {
                    case "text":
                      return (
                        <div>
                        </div>
                      );
                    case "scale":
                      return (
                        <div className="scale-block">
                          <p className="form-label">Scale Slider</p>
                          <input type="number" className="slider-input"
                                 placeholder="minimum value" name="minInput"/>
                          <input type="number" className="slider-input"
                                 placeholder="maximum value" name="maxInput"/>
                          <div className="slider-labels">
                            <p className="form-label">Labels (optional):</p>
                            <input type="text" className="slider-input"
                                   placeholder="min label" name="minLabel"/>
                            <input type="text" className="slider-input"
                                   placeholder="max label" name="maxLabel"/><br/>
                          </div>
                        </div>
                      );
                  }
                })}
                </div>
                <button type="submit" className="form-button">Add Item</button>
              </form>
            </section>
          </div>
          <section className="section-block">
            <div id="editable-questions">
              <p className="form-label">Header Order: </p>
                  {AppStore.questionsInEdit.map(function(question) {
                    var questionIndex = question[0];
                    var questionActive = question[1];
                    var questionTitle = question[2];
                    var questionType = question[3];
                    switch(questionType) {
                      case "text":
                        return (
                          <div className="form-question-block" id={questionActive}
                            draggable="true"
                            onDragStart={this.dragStart.bind(this, questionIndex)}
                            onDragEnter={this.toggleQuestionActive.bind(this, questionIndex)}
                            onDragLeave={this.toggleQuestionActive.bind(this, questionIndex)}
                            onDragOver={this.preventDefault}
                            onDrop={this.drop.bind(this, questionIndex)}>
                            <div className="question-title">{questionTitle}</div>
                          </div>
                        );
                      case "scale":
                        return (
                          <div className="form-question-block" id={questionActive}
                            draggable="true"
                            onDragStart={this.dragStart.bind(this, questionIndex)}
                            onDragEnter={this.toggleQuestionActive.bind(this, questionIndex)}
                            onDragLeave={this.toggleQuestionActive.bind(this, questionIndex)}
                            onDragOver={this.preventDefault}
                            onDrop={this.drop.bind(this, questionIndex)}>
                            <p className="form-label" id="qTitle">{questionTitle}</p>
                            <input type="number" className="slider-input"
                              name="minInput" defaultValue={question[4]}/>
                            <input type="number" className="slider-input"
                              name="maxInput" defaultValue={question[5]}/>
                            <div className="slider-labels">
                              <p className="form-label">Labels (optional):</p>
                              <input type="text" className="slider-input"
                                name="minLabel" defaultValue={question[6]}/>
                              <input type="text" className="slider-input"
                                name="maxLabel" defaultValue={question[7]}/>
                            </div>
                          </div>
                        );
                    }
                  }, this)}
            </div>
          </section>
        </div>
        <div id="sample-form-divider">
          <div id="live-render-sample-form">
            <div id="form-title">{AppStore.formTitle}</div>
            <div>
              {AppStore.questionsInEdit.map(function(question) {
                var questionIndex = question[0];
                var questionActive = question[1];
                var questionTitle = question[2];
                var questionType = question[3];
                switch(questionType) {
                  case "text":
                    return (
                      <div className="live-render-form-question">
                        <p className="form-label">{questionTitle}</p>
                        <input className="form-input" type="text"
                               placeholder="input preview" value="" readOnly="true"/>
                      </div>
                    );
                  case "scale":
                }
                return (
                  <div className="slider-preview">
                    <p className="form-label">{questionTitle}</p>
                    <output className="slider-output" for={"scale" + questionIndex}
                      id={"output"+questionIndex}>5</output><br/>
                    <div>
                      <span className="min-label" for={"scale" + questionIndex}>
                        {question[4]}
                      </span>
                      <span className="max-label" for={"scale" + questionIndex}>
                        {question[5]}
                      </span>
                    </div>
                    <input ref={"scale" + questionIndex} type="range"
                      min={question[4]}
                      max={question[5]}
                      id={"scale"+questionIndex}
                      onChange={this.outputUpdate.bind(this, question[0])}/>
                    <div>
                      <span className="min-label">{question[6]}</span>
                      <span className="max-label">{question[7]}</span>
                    </div>
                  </div>
                );
              }, this)}
            </div>
            <button onClick={this.createFormSchema} className="form-button">Publish Schema</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CreateForm;
