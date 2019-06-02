import React, { Component } from 'react'
import { connect } from 'react-redux';
import './FilteredPatternPicker.css';

import { addFilteredPattern, deleteFilteredPattern } from 'app/common/reducers/filtered-pattern-reducer/actions';

class FilteredPatternPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPatternInputVal: ''
        }
        this.inputRef = React.createRef();
    }

    render() {
        return (
            <div className="filtered-pattern-picker">
                <ul>
                    {this.props.filteredPatterns.map(pattern => (
                        <li key={pattern}>
                            <span>{pattern}</span>
                            <div className="buttons">
                                <button title="Delete pattern" className="red" onClick={() => this.props.deleteFilteredPattern(pattern)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="bottom-actions">
                    <input ref={this.inputRef} onChange={(event) => this.setState({ newPatternInputVal: event.target.value })} placeholder="Add a pattern..."></input>
                    <button className="standard primary" disabled={!this.state.newPatternInputVal} onClick={this.submit}>
                        <i className="fas fa-plus"></i>
                        Add Pattern
                </button>
                </div>
            </div>
        )
    }

    submit = () => {
        this.props.addFilteredPattern(this.state.newPatternInputVal);
        this.setState({ newPatternInputVal: ''});
        if (this.inputRef) {
            this.inputRef.current.value = '';
        }
    }
}



const mapStateToProps = state => ({
    filteredPatterns: state.filteredPatternReducer.filteredPatterns
})

export default connect(mapStateToProps, { addFilteredPattern, deleteFilteredPattern })(FilteredPatternPicker);