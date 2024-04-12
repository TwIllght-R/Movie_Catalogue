const Select = (props) => {
    return (
        <div className="md-3">
            <label htmlFor= {props.name} className="form-label">{props.title}</label>
            <select 
            className="form-select"
            name={props.name}
            id= {props.name}
            value={props.value}
            onChange={props.handleChange}
            >
                <option value="" disabled>{props.placeholder}</option>
                {props.options.map(opt => {
                    return (
                        <option
                        key={opt.id}
                        value={opt.id}
                        >{opt.value}
                        </option>
                    )
                })}

            </select>
            <div className={props.errorDiv}>{props.errorMsg}</div>

        </div>
    )
};
export default Select;