import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

class SearchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchableNames: []
        }
    }

    componentDidMount() {
        //Future API call
        this.setState({
            searchableNames: [
                { value: 'goofy-username', label: 'Misha Rahimi', type: 'user' },
                { value: 'john.quincy', label: 'John Quincy', type: 'user' },
                { value: 'purduecs', label: 'purduecs', type: 'tag' }
            ]
        })
    }

    render() {
        return (
            <Fragment>
                <Select
                    isClearable
                    isSearchable
                    name="color"
                    options={this.state.searchableNames}
                    getOptionLabel={option => {
                        return option.type === 'user' ?
                            `${option.label} @${option.value}`
                            :
                            `r/${option.label}`
                    }}
                    onChange={this.onChange}
                />
            </Fragment>
        );
    }
}

export default SearchBar