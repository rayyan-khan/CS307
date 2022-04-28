import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import axios from 'axios'
import FormatOptionLabel from '../../../components/option'

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
        console.log('chose person')

        this.props.updateConversation(input.value)
    }

    onInputChange = (input) => {
        if (input === '') {
            console.log('empty value, resetting searchable names')
            this.setState({ searchableNames: [] })
        } else {
            axios
                .get('http://localhost:5000/api/dmsearch/' + input)
                .then((response) => {
                    let searchableNames = response.data.filter(
                        (option) => option.type === 'user'
                    )
                    this.setState({
                        searchableNames: searchableNames,
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
                        if (option.type === 'user') {
                            return `${option.label} @${option.value}`
                        } else {
                            return `r/${option.label}`
                        }
                    }}
                    formatOptionLabel={FormatOptionLabel}
                    onChange={this.onChange}
                    onInputChange={this.onInputChange}
                    placeholder="Search"
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    styles={{
                        control: (base) => ({
                            ...base,
                            height: 35,
                            minHeight: 35,
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
                        zIndex: 9999,
                    }}
                />
            </Fragment>
        )
    }
}

export default SearchBar
