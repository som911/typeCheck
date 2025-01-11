const InRange = (min, max) => (v, ctx) => {
    if (v >= min && v <= max) {
        return '';
    }
    return `${ctx} value is out of range(${min},${max}) - ${v}`;
};
const Int = (v, ctx) => {
    if (Number.isInteger(v)) {
        return '';
    }
    return `${ctx} is not Int: ${v}`;
};
const InRangeChars = (min, max) => (v, ctx) => {
    if (v.length >= min && v.length <= max) {
        return '';
    }
    return `${ctx} value is out of chars range min-${min} max-${max} - your ${v.length}`;
}
/////////
const OneOf = (arg) => {
    return {
        name: 'OneOf',
        fun: function (v, ctx) {
            if (arg.indexOf(v) >= 0) {
                return '';
            }
            return `${ctx} value is out of [${arg.join(',')}] - ${v}`;
        }
    }
};
const CanOut = (model) => {
    return {
        name: "CanOut",
        fun: function (response, ctx) {
            return checkModel(model, response, ctx)
        }
    };
};
const FillArr = (model) => {
    return {
        name: "FillArr",
        fun: function (response, ctx) {
            const respType = getType(response);
            if (respType !== 'array') {
                return ctx + ` ${respType}, expect array`;
            }
            let index = 0;
            for(let responseItem of response) {
                const error = checkModel(model, responseItem, ctx + `[${index}]`);
                if(error) {
                    return error;
                }
                index++;
            }
            return '';
        }
    };
}
//return checkModel(model, response, ctx)
/////////

const getNodeType = (model) => {
    if (model.name && model.fun) return "special";
    if (getType(model) !== 'array' || model.length === 0) return 'isNotNode';

    if (model[0] === String) return 'string';
    if (model[0] === Number) return 'number';
    if (model[0] === Boolean) return 'boolean';
    if (model[0] === Array) return 'array';
    if (model[0] === Object) return 'object';
    if (model[0] === Function) return 'function';

    return 'isNotNode';
};
const getType = (obj) => {
    if (Number.isNaN(obj)) return 'NaN';
    if (obj === Infinity) return 'Infinity';
    if (obj === null) return 'null';
    if (Array.isArray(obj)) return 'array';
    return typeof obj;
};
const checkObject = (model, response, ctx) => {
    for (let key in model) {
        if (!response.hasOwnProperty(key)) {
            const isCanOut = model[key].name === 'CanOut';
            if (isCanOut) {
                continue;
            }
            return ctx + ` does not have key '${key}'`;
        }
        //const [type, keyDescription, keyRulles] = model[key];
        const error = checkModel(model[key], response[key], ctx + `.${key}`);
        if (error !== "") {
            return error;
        }
    }
    for (let key in response) {
        if (!model.hasOwnProperty(key)) {
            return ctx + ` has extra key '${key}'`;
        }
    }
    return '';
};
const checkArray = (model, response, ctx) => {
    if (model[0] === "fill") {
        const fillModel = model[1];
        model = new Array(response.length).fill(fillModel);
    }

    if (model.length !== response.length) {
        return (
            ctx +
            ` length is ${response.length} - expext lenght ${model.length}`
        );
    }
    for (let i = 0; i < model.length; i++) {
        // let keyDescription = model[i][1] || "";
        // if (typeof keyDescription !== "string") {
        //     keyDescription = "";
        // }
        // console.log('HE')
        const error = checkModel(
            model[i],
            response[i],
            ctx + `[${i}]`
        );
        if (error) {
            return error;
        }
    }
    return '';
};

const checkModel = (model, response, ctx = '') => {
    const nodeType = getNodeType(model);
    if (nodeType === "isNotNode") {
        // array || object

        const modelType = getType(model);
        const responseType = getType(response);
        if (modelType !== responseType) return ctx + ` ${responseType} expext ${modelType}`;;
        if (!["array", "object"].includes(modelType))
            return `ERROR: isNotNode: is ${modelType}`;

        return {
            array: checkArray,
            object: checkObject
        }[modelType](model, response, ctx);
    }
    if (nodeType === "special") {
        return model.fun(response, ctx);
    }
    // primitivs
    const responseType = getType(response);
    if (responseType !== nodeType)
        return ctx + ` ${responseType} expect ${nodeType}`;
    // primitive type
    // [Number, Fun1, Fun2, Fun3 ]
    if (model.length > 1) {
        for (let i = 1; i < model.length; i++) {
            const error = model[i](response, ctx);
            if (error !== '') {
                return error;
            }
        }
    }

    return '';
};

module.exports = { InRange, Int, InRangeChars, OneOf, CanOut, getNodeType, getType,FillArr, checkModel }