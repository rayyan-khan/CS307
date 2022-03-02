import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import axios from 'axios'
import FormatOptionLabel from './option'

class SearchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchableNames: [],
        }
    }

    componentDidMount() {
        this.setState({
            searchableNames: [],
        })
    }

    onChange = (input) => {
        console.log('changed input')
        if (input.type === 'user') {
            window.location.href =
                'http://localhost:3000/profile/' + input.value
        } else {
            window.location.href = 'http://localhost:3000/tag/' + input.value
        }
    }

    onInputChange = (input) => {
        console.log('input: ' + input)

        if (input === '') {
            console.log('empty value, resetting searchable names')
            this.setState({ searchableNames: [] })
        } else {
            axios
                .get('http://localhost:5000/api/searchUsers/' + input)
                .then((response) => {
                    console.log(response.data)
                    this.setState({
                        searchableNames: response.data,
                    })
                })
                .catch((err) => {
                    console.log('error')
                    this.setState({ searchableNames: [] })
                })
        }
    }

    render() {
        return (
            <Fragment>
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    isSearchable
                    name="color"
                    options={this.state.searchableNames}
                    getOptionLabel={(option) => {
                        return option.type === 'user'
                            ? `${option.label} @${option.value}`
                            : `r/${option.label}`
                    }}
                    formatOptionLabel={FormatOptionLabel}
                    onChange={this.onChange}
                    onInputChange={this.onInputChange}
                    placeholder="Search"
                    styles={{
                        control: base => ({
                            ...base,
                            height: 35,
                            minHeight: 35
                        }),
                        dropdownIndicator: (styles) => ({
                            ...styles,
                            paddingTop: 7,
                            paddingBottom: 7,
                        }),
                        clearIndicator: (styles) => ({
                            ...styles,
                            paddingTop: 7,
                            paddingBottom: 7,
                        }),
                    }}
                />
            </Fragment>
        )
    }
}

export default SearchBar
