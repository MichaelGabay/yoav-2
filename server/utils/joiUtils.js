const validate = ({ schema, data }) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const customErros = {}
        for (let detail of error.details) {
            customErros[detail.path[0]] = detail.message
        }
        throw customErros;
    }
    return true
}



export { validate }



