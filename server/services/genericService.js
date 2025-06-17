const genericService = {

    async getById(model, id) {
        const Model = require(`../models/${model}`);
        return await Model.findByPk(id);
    },

    async update(model, id, data) {
        const Model = require(`../models/${model}`);

        if (Array.isArray(id)) {
            // עדכון קבוצתי
            const result = await Model.update(data, { where: { id } });
            return result; // מחזיר [כמות רשומות שעודכנו]
        } else {
            // עדכון רגיל
            const instance = await Model.findByPk(id);
            if (!instance) return null;
            return await instance.update(data);
        }
    },

    async delete(model, id) { //TODO: soft delete
        const Model = require(`../models/${model}`);
        return await Model.destroy({ where: { id } });
    },

    async getByParams(model, params) {
        const Model = require(`../models/${model}`);

        return await Model.findAll({
            where: params,
        });
    },

    async getByParamsLimit(model, params) {
        console.log('getByParamsLimit');

        const Model = require(`../models/${model}`);

        const { page = 1, limit = 10, ...filters } = params;
        const offset = (page - 1) * limit;

        return await Model.findAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    },

    async create(model, data) {
        console.log(`Creating new ${model} with data:`, data);

        const Model = require(`../models/${model}`);

        if (Array.isArray(data)) {
            return await Model.bulkCreate(data);
        } else {
            return await Model.create(data);

        }
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