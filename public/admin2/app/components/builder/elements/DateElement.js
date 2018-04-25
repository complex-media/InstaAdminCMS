import React from 'react';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';

export default class DateElement extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <DatePicker label={this.props.formData.name} sundayFirstDayOfWeek value={this.props.formData.value?new Date(Date.parse(this.props.formData.value)): new Date()} onChange={(val)=>{console.log(val.toISOString()),this.props.handleFormChange(val.toISOString(),'value')}} />
            </div>
        )
    }
}