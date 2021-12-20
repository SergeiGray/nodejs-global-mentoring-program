export const modelDefinition = (connection, modelName, model) => {
    if (connection && connection.define) {
        const Model = connection.define(modelName, model, {timestamps: false});

        Model.sync({ force: true });

        return Model;
    }
};