export const connectToDatabase = (connection, modelName, model) => {
    if (connection && connection.define) {
        const Model = connection.define(modelName, model, {timestamps: false});

        Model.sync({ alter: true });

        return Model;
    }
};