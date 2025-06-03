const genericService = {

    async getById(model, id) {
        const Model = require(`../models/${model}`);
        return await Model.findByPk(id);
    },

    async update(model, id, data) {
        const Model = require(`../models/${model}`);
        const instance = await Model.findByPk(id);
        if (!instance) return null;
        return await instance.update(data);
    },

    async delete(model, id) { //TODO: soft delete
        const Model = require(`../models/${model}`);
        return await Model.destroy({ where: { id } });
    },

    async getByParams(model, params) {
        const Model = require(`../models/${model}`);
        return await Model.findAll({ where: params });
    },

    async create(model, data) {
        const Model = require(`../models/${model}`);
        return await Model.create(data);
    },

    async getAdvanced(model, conditions, include = null) {
        const Model = require(`../models/${model}`);
        const options = { where: conditions };
        if (include) {
            const associations = Array.isArray(include)
                ? include.map(name => ({ model: require(`../models/${name}`) }))
                : [{ model: require(`../models/${include}`) }];
            options.include = associations;
        }
        return await Model.findAll(options);
    }, 

    async getByForeignKey(model, foreignKey, value) {
        const Model = require(`../models/${model}`);
        const where = {};
        where[foreignKey] = value;
        return await Model.findAll({ where });
    },

    async getAll(model) {
        const Model = require(`../models/${model}`);
        return await Model.findAll();
    }

};

module.exports = genericService;