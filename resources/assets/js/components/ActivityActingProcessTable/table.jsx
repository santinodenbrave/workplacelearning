import React from "react";
import Row from "./row";
import FilterRule from "./filterRule";
import _ from "lodash";
import moment from "moment";
import DatePicker from "react-datepicker";

export default class ActivityActingProcessTable extends React.Component {

    mode = window.activityActingTableMode;

    constructor(props) {
        super(props);
        let earliestDate = moment(), latestDate = moment();
        window.activities.forEach(activity => {
            if (moment(activity.date, "DD-MM-YYYY") < earliestDate || earliestDate === undefined) {
                earliestDate = moment(activity.date, "DD-MM-YYYY");
            }
            if (moment(activity.date, "DD-MM-YYYY") > latestDate || latestDate === undefined) {
                latestDate = moment(activity.date, "DD-MM-YYYY");
            }
        });

        this.state = {
            activities: window.activities,
            filters: this.buildFilter(window.activities),
            exports: ["Word (.docx)", "E-mail Word document"],
            selectedExport: "Word (.docx)",
            exportReflections: true,
            email: "",
            emailComment: "",
            emailAlert: null,
            startDate: earliestDate.toDate(),
            endDate: latestDate.toDate(),
        };

        this.updateFilter = this.updateFilter.bind(this);
        this.exportHandler = this.exportHandler.bind(this);
    }

    // Build filter rules from the provided activity data
    buildFilter(activities) {
        let filters = {
            timeslot: {rules: [], selectedRules: []},
            learningGoal: {rules: [], selectedRules: []},
            competence: {rules: [], selectedRules: []}
        };


        // Build filters
        activities.map((activity) => {

            let timeslot = activity.timeslot;
            if (filters.timeslot.rules.indexOf(timeslot) === -1) {
                filters.timeslot.rules.push(timeslot);
            }

            let learningGoal = activity.learningGoal;
            if (filters.learningGoal.rules.indexOf(learningGoal) === -1) {
                filters.learningGoal.rules.push(learningGoal);
            }

            let competencies = activity.competence;
            competencies.forEach(competence => {
                if (filters.competence.rules.indexOf(competence) === -1) {
                    filters.competence.rules.push(competence);
                }
            });

        });

        // Sorting string might get weird (10e lesuur becoming first item), so own callback for sort.
        filters.timeslot.rules.sort((a, b) => {
            return parseInt(a) - parseInt(b)
        });

        filters.learningGoal.rules.sort();
        filters.competence.rules.sort();

        return filters;
    }

    updateFilter(type, rule) {
        // Deepclone the state
        let newFilterState = _.cloneDeep(this.state.filters);

        // Check if clicked rule is already "on"
        let index = newFilterState[type].selectedRules.indexOf(rule);
        if (index > -1) {
            // Disable rule
            newFilterState[type].selectedRules.splice(index, 1);
        } else {
            // Enable rule
            newFilterState[type].selectedRules.push(rule);
        }

        // Update state
        this.setState({filters: newFilterState});
    }

    filterActivities(activities) {

        return activities
        // Filter for Timeslot
            .filter((activity) => {
                if (this.state.filters.timeslot.selectedRules.length === 0) {
                    return true;
                }

                return this.state.filters.timeslot.selectedRules.indexOf(activity.timeslot) > -1;
            })
            // Filter for learningGoal
            .filter((activity) => {
                if (this.state.filters.learningGoal.selectedRules.length === 0) {
                    return true;
                }

                return this.state.filters.learningGoal.selectedRules.indexOf(activity.learningGoal) > -1;
            })
            // Filter for competence
            .filter((activity) => {
                if (this.state.filters.competence.selectedRules.length === 0) {
                    return true;
                }

                return activity.competence.some(competence => {
                    return this.state.filters.competence.selectedRules.indexOf(competence) > -1;
                });
            })
            .filter((activity) => {
                return moment(activity.date, "DD-MM-YYYY").isSameOrAfter(this.state.startDate) &&
                    moment(activity.date, "DD-MM-YYYY").isSameOrBefore(this.state.endDate)
            })
    }

    exportHandler() {
        let ids = this.filterActivities(this.state.activities).map(activity => activity.id);
        const includeReflections = (this.state.exportReflections ? 1 : 0);
        if (this.state.selectedExport === "E-mail Word document") {
            this.setState({emailAlert: undefined});
            let email = this.state.email;
            let comment = this.state.emailComment;


            const cb = response => {
                if (response.hasOwnProperty("data") && response.data.status === "success") {
                    this.setState({email: "", emailComment: '', emailAlert: true});
                } else {
                    this.setState({email: "", emailComment: '', emailAlert: false});
                }
                setTimeout(() => this.setState({emailAlert: null}), 3000);
            };

            axios.post(window.mailExportActivitiesUrl, {email, comment, ids, 'reflections': includeReflections})
                .then(cb)
                .catch(cb);

        } else if (this.state.selectedExport === "Word (.docx)") {

            window.location.href = `${window.exportActivitiesUrl}?reflections=${includeReflections}&ids[]=${ids.join('&ids[]=')}`;
        }
    }

    isMini = () => this.mode === 'mini';
    isDetail = () => this.mode === 'detail';

    render() {
        let filteredActivities = this.filterActivities(this.state.activities);
        return <div>
            {this.isDetail() && this.renderFilter()}

            {this.isDetail() && this.renderExport()}

            {this.isMini() && <a href={window.progressLink}>{Lang.get('react.progress-link-label')}</a>}
            <div className="table-responsive">
                <table className="table blockTable">
                    <thead className="blue_tile">
                    <tr>
                        <td>{/* Edit URL, no table header */}</td>
                        <td></td>
                        <td>{Lang.get('react.date')}</td>
                        <td>{Lang.get('react.situation')}</td>
                        <td>{Lang.get('react.category')}</td>
                        <td>{Lang.get('react.with-whom')}</td>
                        <td>{Lang.get('react.theory')}</td>
                        <td>{Lang.get('react.learningpoints-followup')}</td>
                        <td>{Lang.get('react.learningquestion')}</td>
                        <td>{Lang.get('react.competence')}</td>
                        <td>{Lang.get('react.evidence')}</td>
                        <td>{Lang.get('react.reflection')}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredActivities.map((activity) => {
                        return <Row key={activity.id} activity={activity}/>
                    })}

                    </tbody>
                </table>
            </div>
        </div>
    }

    downloadMultiple = () => {
        const ids = this.filterActivities(this.state.activities).filter(activity => activity.reflection !== null).map(activity => activity.reflection.id);
        const url = window.reflectionDownloadMultipleUrl + '?' + ids.map(id => 'ids[]=' + id).join('&');
        window.location.href = url;
    }

    renderFilter() {
        return <div>
            <h3 style={{cursor: "pointer"}} onClick={() => {
                $('.filters').slideToggle()
            }}><i className="fa fa-arrow-circle-o-down" aria-hidden="true"/> {Lang.get('react.filters')}</h3>
            <div className="filters row">
                <div className="date col-md-3">
                    <h4>{Lang.get('react.date')}</h4>
                    <div>
                        <strong>{Lang.get('react.startdate')}:</strong><br/>
                        <DatePicker className={"form-control"} selected={this.state.startDate} dateFormat="dd/MM/yyyy"
                                    onChange={date => this.setState({startDate: date})}/>
                        <br/><br/>
                        <strong>{Lang.get('react.enddate')}:</strong><br/>
                        <DatePicker className={"form-control"} selected={this.state.endDate} dateFormat="dd/MM/yyyy"
                                    onChange={date => this.setState({endDate: date})}/>
                    </div>
                    <div style={{clear: 'both'}}/>
                </div>
                <div className="timeslot col-md-4">
                    <h4>{Lang.get('react.category')}</h4>
                    <div className="buttons">
                        {this.state.filters.timeslot.rules.map(rule => {
                            return <FilterRule key={rule} type="timeslot" onClickHandler={this.updateFilter} rule={rule}
                                               activated={this.state.filters.timeslot.selectedRules.indexOf(rule) > -1}/>
                        })}
                    </div>
                    <div style={{clear: 'both'}}/>
                </div>

                <div className="learningGoal col-md-4">
                    <h4>{Lang.get('react.learningquestion')}</h4>
                    <div className="buttons">
                        {this.state.filters.learningGoal.rules.map(rule => {
                            return <FilterRule key={rule} type="learningGoal" onClickHandler={this.updateFilter}
                                               rule={rule}
                                               activated={this.state.filters.learningGoal.selectedRules.indexOf(rule) > -1}/>
                        })}
                    </div>
                    <div style={{clear: 'both'}}/>
                </div>
                <div className="competence col-md-4">
                    <h4>{Lang.get('react.competence')}</h4>
                    <div className="buttons">
                        {this.state.filters.competence.rules.map(rule => {
                            return <FilterRule key={rule} type="competence" onClickHandler={this.updateFilter}
                                               rule={rule}
                                               activated={this.state.filters.competence.selectedRules.indexOf(rule) > -1}/>
                        })}
                    </div>
                    <div style={{clear: 'both'}}/>
                </div>

            </div>
            <br/>
        </div>
    }

    renderExport() {
        return <div className="row">
            <div className="col-md-2">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="export" style={{paddingBottom: "15px"}}>

                            <label>{Lang.get('react.export-to')}</label>
                            <br/>
                            <select onChange={e => {
                                this.setState({selectedExport: e.target.value})
                            }} defaultValue={this.state.selectedExport} style={{marginTop: '5px', width: '100%'}}>
                                {this.state.exports.map(type => {
                                    return <option key={type} value={type}>{type}</option>
                                })}
                            </select>
                            <br/>
                            <label style={{marginTop: '5px'}}>
                                <input type="checkbox" checked={this.state.exportReflections}
                                       onChange={() => this.setState({exportReflections: !this.state.exportReflections})}/>
                                &nbsp;{Lang.get('react.with-reflections')}
                            </label>
                            <br/>
                            {this.state.selectedExport === 'E-mail Word document' &&
                            <div style={{maxWidth: "400px", marginTop: '5px'}}>
                                <label>
                                    {Lang.get('react.mail-to')}: <input type="email" className="form-control"
                                                                        onChange={e => this.setState({email: e.target.value})}
                                                                        value={this.state.email}/>
                                </label><br/>
                                <label>
                                    {Lang.get('react.mail-comment')}: <textarea className="form-control"
                                                                                onChange={e => this.setState({emailComment: e.target.value})}
                                                                                value={this.state.emailComment}/>
                                </label>
                                {
                                    this.state.emailAlert === undefined &&
                                    <div className="alert alert-info"
                                         role="alert">{Lang.get('react.mail.sending')}</div>
                                }
                                {
                                    this.state.emailAlert === true &&
                                    <div className="alert alert-success"
                                         role="alert">{Lang.get('react.mail.sent')}</div>
                                }
                                {
                                    this.state.emailAlert === false &&
                                    <div className="alert alert-danger"
                                         role="alert">{Lang.get('react.mail.failed')}</div>
                                }
                            </div>
                            }

                            <button className="btn btn-info" onClick={this.exportHandler} style={{marginTop: '5px'}}
                                    disabled={this.state.activities.length === 0 || (this.state.selectedExport === 'E-mail Word document' && (!this.state.email.includes('@') || !this.state.email.includes('.')))}>
                                {Lang.get('react.export')}</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}