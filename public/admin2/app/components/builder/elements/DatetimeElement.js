import React from 'react';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';
import TimePicker from 'react-toolbox/lib/time_picker';

export default class DatetimeElement extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <DatePicker label={this.props.formData.name + ' Date'} sundayFirstDayOfWeek value={this.props.formData.value?new Date(Date.parse(this.props.formData.value)): new Date()} onChange={(val)=>{console.log(val.toISOString()),this.props.handleFormChange(val.toISOString(),'value')}} />
                <TimePicker label={this.props.formData.name + ' Time'} format="ampm" value={this.props.formData.value?new Date(Date.parse(this.props.formData.value)): new Date()} onChange={(val)=>{console.log(val.toISOString()),this.props.handleFormChange(val.toISOString(),'value')}} />
            </div>
        )
    }
}