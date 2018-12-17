import React from 'react';
import './App.sass';

let todo_list =    [{key: 1, task: "Первая", data: "16-12-2018"},
                    {key: 2, task: "Вторая", data: "16-12-2018"},
                    {key: 3, task: "Третья", data: "16-12-2018"},
                    {key: 4, task: "Четвертая", data: "16-12-2018"}];

function Task (props) {
    return (
        <div className = "task">
            <div className = "task__key">{props.todo_list.key}</div>
            <div className = "task__information">
                <span className="task__title">{props.todo_list.task}</span>
                <i className="material-icons task__edit" onClick={(event) => props.openDialogEdit(event.target)}>create</i>
            </div>
            <div className = "task__data">{props.todo_list.data}</div>
            <div className = "task__delite">
                <i className="material-icons" onClick={(event) => props.openDialogDelete(event.target)}>delete</i>
            </div>
        </div>
    )
}


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            drawer: false,
            btnDisabled: true,
            loaderToolbar: false,
            loaderList: true,
            snackbarError: false,
            btnAddTaskShow: false,
            dialogEdit: false,
            dialogDelete: false,
            showProgressBar: false,
            taskKey: "",
            todo_list: todo_list.concat()
        };

        this.handleInput = this.handleInput.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        this.addTask = this.addTask.bind(this);
        this.showError = this.showError.bind(this);
        this.loadingList = this.loadingList.bind(this);
        this.openDialogEdit = this.openDialogEdit.bind(this);
        this.closeDialogEdit = this.closeDialogEdit.bind(this);
        this.openDialogDelete = this.openDialogDelete.bind(this);
        this.closeDialogDelete = this.closeDialogDelete.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    handleInput(event) {
        const input = event.target;

        if ((input.value && input.value !== "") || input.innerText.trim() !== "") {
            input.classList.add('not-empty');
            this.setState({btnDisabled: false, taskValue: input.value});
        }
        else {
            input.classList.remove('not-empty');
            this.setState({btnDisabled: true});
        }
    }

    showDrawer() {
        this.setState({drawer: true, btnAddTaskShow: true});
    }

    addTask() {
        this.setState({loaderToolbar: true});
        const symbolError = "!"

        setTimeout(
            function() {
                if (this.state.taskValue.indexOf(symbolError) === -1){
                    this.setState({loaderToolbar: false, drawer: false, btnDisabled: true});
                    let current_data = new Date();
                    current_data = (current_data.getDate() + "-" + (current_data.getMonth() + 1) + "-" + current_data.getFullYear());
                    todo_list.push({key: (todo_list.length + 1), task: this.state.taskValue, data: current_data});
                    this.setState({todo_list: todo_list.concat()});
                } else {
                    this.setState({loaderToolbar: false, btnDisabled: true});
                    this.showError();
                }
            }
                .bind(this),
            2000
        );

    }

    deleteTask() {
        this.setState({showProgressBar: true});

        setTimeout(
            function() {
                    delete todo_list[(this.state.taskKey - 1)];
                    this.setState({todo_list: todo_list.concat()});
                    this.setState({showProgressBar: false});
                    this.closeDialogDelete();
                }
                .bind(this),
            2000
        );
    }

    closeDialog() {
        this.setState({showProgressBar: true});
        let newValue = document.getElementsByClassName("form-group__input")[0].value;

        setTimeout(
            function() {
                todo_list[(this.state.taskKey - 1)].task = newValue;
                this.setState({todo_list: todo_list.concat()});
                this.setState({showProgressBar: false});
                this.closeDialogEdit();
            }
                .bind(this),
            2000
        );
    }

    showError(){
        this.setState({snackbarError: true});
        setTimeout(
            function() {
                this.setState({snackbarError: false});
                }
                .bind(this),
            4000
        );
    }

    loadingList(){
        setTimeout(
            function() {
                this.setState({loaderList: false});
                if ( this.state.todo_list && this.state.todo_list.length) {
                    this.setState({btnAddTaskShow: true});
                }
            }
                .bind(this),
            2000
        );
    }

    openDialogEdit(eventTarget){
        this.setState({taskKey : (eventTarget.parentElement.parentElement.getElementsByClassName("task__key")[0].textContent)});
        this.setState({dialogEdit: true});
    }

    closeDialogEdit(){
        this.setState({dialogEdit: false});
    }

    openDialogDelete(eventTarget){
        this.setState({taskKey : (eventTarget.parentElement.parentElement.getElementsByClassName("task__key")[0].textContent)});
        this.setState({dialogDelete: true});
    }

    closeDialogDelete(){
        this.setState({dialogDelete: false});
    }


    render () {
        return (
            <div className = "taskList">
                {this.loadingList()}

                {this.state.dialogDelete ?
                    <div className="dialog">
                        {
                            this.state.showProgressBar ?
                                <div className="dialog__message dialog__message--loader">
                                    <div className="progressBar">
                                        <div className="progressBar__indicator"/>
                                    </div>
                                </div> :

                                <div className="dialog__message">
                                    <p className="dialog__title">Удалить выбранную задачу?</p>
                                    <div className="dialog__action">
                                        <button className="button button--secondary"
                                                onClick={this.closeDialogDelete}
                                        >
                                            Отмена
                                        </button>
                                        <button className="button button--secondary"
                                                onClick={(event) => {this.deleteTask(event)}}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                        }
                    </div> : null
                }
                {this.state.dialogEdit ?
                    <div className="dialog">
                        {
                            this.state.showProgressBar ?
                                <div className="dialog__message dialog__message--loader">
                                    <div className="progressBar">
                                        <div className="progressBar__indicator"/>
                                    </div>
                                </div> :

                                <div className="dialog__message">

                                    <div className="dialog__content form-group ">
                                        <input className="form-group__input"  type="text"  onInput={this.handleInput}/>
                                        <span className="form-group__highlight"/>
                                        <span className="form-group__bar"/>
                                        <label className="form-group__title"/>
                                    </div>

                                    <div className="dialog__action">
                                        <button className="button button--secondary"
                                                onClick={this.closeDialogEdit}
                                        >
                                            Отмена
                                        </button>
                                        <button className="button button--secondary"
                                                onClick={this.closeDialog}
                                        >
                                            Сохранить
                                        </button>
                                    </div>
                                </div>
                        }

                    </div> : null
                }

                <div className="taskList__header">
                    Список задач
                </div>
                {this.state.loaderList ?

                    <div className="loader loader--list">
                        <p className="loader__text">Задачи загружаются ...</p>
                        <svg className="loader__spinner" viewBox="25 25 50 50">
                            <circle className="loader__path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
                        </svg>
                    </div> :

                    <div className ={"taskList__list " + (this.state.drawer ? "taskList__list--disabled" : "")}>
                        <div className = "task task--head">
                            <div className = "task__key">id</div>
                            <div className = "task__information">Наименование задачи</div>
                            <div className = "task__data">Дата создания</div>
                            <div className = "task__delite"></div>
                        </div>
                        <div className="">
                            {   this.state.todo_list && this.state.todo_list.length ?

                                this.state.todo_list.map((value, index)=>
                                    <Task todo_list = {value}
                                          openDialogEdit={this.openDialogEdit}
                                          openDialogDelete={this.openDialogDelete}
                                          key={index}
                                    />
                                ) :
                                <div className="blankPage">
                                    <p className="blankPage__text">В вашем списке нет задач</p>
                                    <button className="button button--primary"
                                            onClick={this.showDrawer}
                                    >
                                        Создать первую задачу
                                    </button>
                                </div>
                            }
                        </div>

                    </div> }

                <button className={"taskList__addTask " + (this.state.btnAddTaskShow ? "taskList__addTask--is-active" : "")} onClick={this.showDrawer}>
                    <i className="material-icons material-icons--color-white">add</i>
                </button>

                <div className={"drawer " + (this.state.drawer ? "drawer--is-active" : "")}>
                    <h3 className="drawer__title">Toolbar</h3>

                    {this.state.loaderToolbar ?

                        <div className="loader">
                            <p className="loader__text">Подождите, идет добавление</p>
                            <svg className="loader__spinner" viewBox="25 25 50 50">
                                <circle className="loader__path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
                            </svg>
                        </div> :

                        <form className="drawer__form">

                            <div className="form-group">
                                <input className="form-group__input"  type="text" ref="nameInput" onInput={this.handleInput}/>
                                <span className="form-group__highlight"/>
                                <span className="form-group__bar"/>
                                <label className="form-group__title">Задача</label>
                            </div>

                            <button className="button button--primary"
                                disabled={this.state.btnDisabled}
                                onClick={this.addTask}
                            >
                                Добавить задачу
                            </button>


                            <div className={"snackbar " + (this.state.snackbarError ? "snackbar--is-active" : "")}>
                                Произошел сбой. Задача не добавлена.
                            </div>

                        </form>
                    }
                </div>

            </div>

        )
    }
}

export default App;
