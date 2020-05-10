import * as React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {actions} from "../Tips/redux/entities";
import {Schema} from "../../Schema";
import {normalize} from "normalizr";

class UpdateForm extends React.Component {

    constructor(props) {
        super(props);
        if (props.loading) {
            this.state = {};
            return;
        }
        this.state = {
            name: props.source.name,
            education_program_type: props.source.education_program_type,
            select_type: props.source.select_type,
            statisticVariableOneFilters: props.source.statisticVariableOneFilters,
            statisticVariableTwoFilters: props.source.statisticVariableTwoFilters,
            operatorIndex: props.source.operator,
            submitting: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.id !== this.props.id) {
            this.setState(
                {
                    name: prevProps.source.name,
                    education_program_type: prevProps.source.education_program_type,
                    select_type: prevProps.source.select_type,
                    statisticVariableOneFilters: prevProps.source.statisticVariableOneFilters,
                    statisticVariableTwoFilters: prevProps.source.statisticVariableTwoFilters,
                    operatorIndex: prevProps.source.operator,
                }
            );
        }
    }

    operatorIndex(operatorToFind) {
        return this.props.operators.findIndex(operator => operator.type === operatorToFind.type);
    }

    selectEducationProgramType = (value) => {
        this.setState({
            education_program_type: value,
            statisticVariableOneFilters: JSON.parse(JSON.stringify(this.props.variableFilters[value])),
            statisticVariableTwoFilters: JSON.parse(JSON.stringify(this.props.variableFilters[value])),
        });
        // If switched to acting, check if selecttype is on hours, if so, change to count as Acting doesnt support hours selecttype
        if (value === 'acting' && this.state.select_type === 'hours') {
            this.setState({select_type: 'count'})
        }
    };

    selectSelectType = (value) => {
        this.setState({select_type: value});
    };


    updateFilter = (number, filterIndex, parameterIndex, value) => {

        const filter = number === 'one' ? {...this.state.statisticVariableOneFilters[filterIndex]} : {...this.state.statisticVariableTwoFilters[filterIndex]};
        const parameters = [...filter.parameters];
        const parameter = parameters[parameterIndex];
        parameter.value = value;

        parameters[parameterIndex] = parameter;
        filter.parameters = parameters;

        const filters = number === 'one' ? [...this.state.statisticVariableOneFilters] : [...this.state.statisticVariableTwoFilters];
        filters[filterIndex] = filter;
        number === 'one' ? this.setState({statisticVariableOneFilters: filters}) : this.setState({statisticVariableTwoFilters: filters});
    };


    submit() {
        if (!this.validate()) {
            return false;
        }

        this.setState({submitting: true});
        axios.put(`/api/statistics/${this.props.id}`, {
            name: this.state.name,
            operator: this.props.operators[this.state.operatorIndex].type,
            education_program_type: this.state.education_program_type,
            select_type: this.state.select_type,
            statisticVariableOne: {
                filters: this.state.statisticVariableOneFilters,
            },
            statisticVariableTwo: {
                filters: this.state.statisticVariableTwoFilters,
            },
        }).then(response => {
            this.setState({submitting: false});
            this.props.onUpdated(response.data);
        }).catch(error => {
            console.log(error);
            this.setState({submitting: false});
        });

    }

    validate() {
        if (this.state.name === '') {
            alert(Lang.get('react.statistic.errors.name'));
            return false;
        }
        const operator = this.props.operators[this.state.operatorIndex];

        if (operator.type < 0 || operator.type > 3) return false;
        if (this.state.education_program_type === '') {
            alert(Lang.get('react.statistic.errors.select-two-variables'));
            return false;
        }

        return true;
    }

    render() {
        if (this.props.loading) return null;

        return <div>
            <div className="row">
                <div className="col-lg-12">
                    <strong>{Lang.get('react.statistic.statistic-name')}</strong><br/>
                    <input onChange={e => this.setState({name: e.target.value})} value={this.state.name}
                           className="form-control" type="text" maxLength={255}/>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-lg-6">
                    <strong>{Lang.get('statistics.activity-type')}</strong>
                    <select className="form-control"
                            onChange={e => this.selectEducationProgramType(e.target.value)}
                            value={this.state.education_program_type}>
                        <option value="acting">Acting</option>
                        <option value="producing">Producing</option>
                    </select>
                </div>
                <div className="col-lg-6">
                    <strong>{Lang.get('statistics.select')}</strong>
                    <select className="form-control"
                            onChange={e => this.selectSelectType(e.target.value)}
                            value={this.state.select_type}>
                        <option value="count">{Lang.get('statistics.variable-select-count')}</option>
                        <option value="hours"
                                disabled={this.state.education_program_type === 'acting'}>{Lang.get('statistics.variable-select-hours')}</option>
                    </select>
                </div>
            </div>

            <hr/>
            <div className="row">
                <div className="col-md-4">

                    <h4>{Lang.get('react.statistic.select-variable-one')} filters</h4>
                    {
                        this.state.statisticVariableOneFilters.map((filter, filterIndex) => {

                            return <div key={filter.name}>
                                <strong>{Lang.get('statistics.filters.' + filter.name)}</strong>
                                {
                                    filter.parameters.map((parameter, parameterIndex) => {
                                        return <div key={parameter.name}>
                                            <input value={parameter.value || ''}
                                                   placeholder={parameter.name}
                                                   onChange={e => this.updateFilter('one', filterIndex, parameterIndex, e.target.value)}
                                                   type="text" className="form-control" maxLength={255}/>
                                        </div>;
                                    })
                                }
                            </div>;
                        })
                    }
                </div>

                <div className="col-md-4">
                    <h4>{Lang.get('react.statistic.select-operator')}</h4>
                    <select className="form-control" onChange={e => this.setState({
                        operatorIndex: parseInt(e.target.value)
                    })} value={this.state.operatorIndex}>
                        {this.props.operators.map(
                            operator =>
                                <option key={operator.label}
                                        value={this.operatorIndex(operator)}>
                                    {operator.label}
                                </option>)}
                    </select>
                </div>

                <div className="col-md-4">

                    <h4>{Lang.get('react.statistic.select-variable-two')} filters</h4>
                    {
                        this.state.statisticVariableTwoFilters.map((filter, filterIndex) => {

                            return <div key={filter.name}>
                                <strong>{Lang.get('statistics.filters.' + filter.name)}</strong>
                                {
                                    filter.parameters.map((parameter, parameterIndex) => {
                                        return <div key={parameter.name}>
                                            <input value={parameter.value || ''}
                                                   placeholder={parameter.name}
                                                   onChange={e => this.updateFilter('two', filterIndex, parameterIndex, e.target.value)}
                                                   type="text" className="form-control" maxLength={255}/>
                                        </div>;
                                    })
                                }
                            </div>;
                        })
                    }
                </div>
            </div>

            <br/>
            <p style={{whiteSpace: 'pre-line'}}>
                {Lang.get('statistics.variable-help')}
            </p>
            <button type="button" className="btn btn-primary" disabled={this.state.submitting}
                    onClick={() => this.submit()}>

                {this.state.submitting &&
                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"/>}
                {!this.state.submitting && <span>{Lang.get('react.statistic.save')}</span>}
            </button>

        </div>;
    }
}

const mapState = (state, {id, history}) => {
    const selectedStatistic = state.entities.statistics[id];

    if (selectedStatistic === undefined) {
        history.push('/');
        return {
            loading: true,
        }
    }

    const currentVariableOne = state.entities.statisticVariables[selectedStatistic.statistic_variable_one];
    const currentVariableTwo = state.entities.statisticVariables[selectedStatistic.statistic_variable_two];

    return {
        history,
        id: selectedStatistic.id,
        operators: [
            {type: 0, label: "+"},
            {type: 1, label: "-"},
            {type: 2, label: "*"},
            {type: 3, label: "/"},
        ],
        variableFilters: state.tipEditPageUi.variableFilters,
        source: {
            education_program_type: selectedStatistic.education_program_type,
            select_type: selectedStatistic.select_type,
            name: selectedStatistic.name || '',
            statisticVariableOneType: currentVariableOne.type,
            statisticVariableOneFilters: currentVariableOne.filters,
            statisticVariableTwoType: currentVariableTwo.type,
            statisticVariableTwoFilters: currentVariableTwo.filters,
            operator: selectedStatistic.operator
        }
    }
};

const mapDispatch = dispatch => {
    return {
        onUpdated: newEntity => {
            dispatch(actions.addEntities(normalize(newEntity, Schema.statistic).entities));
        }
    }
};

export default withRouter(connect(mapState, mapDispatch)(UpdateForm));