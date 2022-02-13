import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import axios from 'axios'

class SearchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchableNames: [],
        }
    }

    componentDidMount() {
        //Future API call
        this.setState({
            searchableNames: [
                {
                    value: 'goofy-username',
                    label: 'Misha Rahimi',
                    type: 'user',
                },
                { value: 'john.quincy', label: 'John Quincy', type: 'user' },
                { value: 'bayyan-sm', label: 'Bayyan', type: 'user' },
                { value: 'rayyan23', label: 'Rayyan', type: 'user' },
                {
                    value: 'ReactJS-is-hard',
                    label: 'ReactJS-is-hard',
                    type: 'tag',
                },
                { value: 'shell_project', label: 'shell_project', type: 'tag' },
                { value: 'max-p', label: 'Max P', type: 'user' },
                { value: 'purduecs', label: 'purduecs', type: 'tag' },
            ],
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
        console.log(input)
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
                console.log(err)
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
                    getOptionLabel={(option) => {
                        return option.type === 'user'
                            ? `${option.label} @${option.value}`
                            : `r/${option.label}`
                    }}
                    onChange={this.onChange}
                    onInputChange={this.onInputChange}
                />
            </Fragment>
        )
    }
}

export default SearchBar
