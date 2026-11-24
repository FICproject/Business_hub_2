import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';

/**
 * 1. Get all categories (both service and material)
 */
export const getAllCategories = async (req, res) => {
  try {
    const { type } = req.query; // 'service' | 'material' | optional

    const serviceCategories = (dbStore.collection.serviceCategories || []).sort((a, b) => (a.order || 0) - (b.order || 0));
    const materialCategories = (dbStore.collection.materialCategories || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    if (type === 'service') {
      return res.json({ success: true, categories: serviceCategories });
    }
    if (type === 'material') {
      return res.json({ success: true, categories: materialCategories });
    }

    return res.json({
      success: true,
      serviceCategories,
      materialCategories,
      totalCount: serviceCategories.length + materialCategories.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Create a new category
 */
export const createCategory = async (req, res) => {
  try {
    const { type, name, description, icon, image, order, subcategories } = req.body;

    if (!type || !name) {
      return res.status(400).json({ success: false, message: 'Type ("service" or "material") and name are required.' });
    }

    const newCategory = {
      _id: 'CAT-' + uuidv4().slice(0, 8).toUpperCase(),
      type: type === 'material' ? 'material' : 'service',
      name: name.trim(),
      description: description || '',
      icon: icon || 'Briefcase',
      image: image || '',
      order: Number(order) || 0,
      isActive: true,
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const targetList = newCategory.type === 'material' ? dbStore.collection.materialCategories : dbStore.collection.serviceCategories;
    targetList.push(newCategory);
    dbStore.save();

    logAudit(
      req.user?._id || 'admin',
      req.user?.fullName || 'Admin',
      'admin',
      'CATEGORY_CREATED',
      'Category',
      newCategory._id,
      `Created ${newCategory.type} category: ${newCategory.name}`
    );

    return res.status(201).json({ success: true, message: 'Category created successfully.', category: newCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Update an existing category
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, image, order, isActive, subcategories } = req.body;

    let target = dbStore.collection.serviceCategories.find((c) => c._id === id);
    let targetType = 'service';

    if (!target) {
      target = dbStore.collection.materialCategories.find((c) => c._id === id);
      targetType = 'material';
    }

    if (!target) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name !== undefined) target.name = name.trim();
    if (description !== undefined) target.description = description;
    if (icon !== undefined) target.icon = icon;
    if (image !== undefined) target.image = image;
    if (order !== undefined) target.order = Number(order);
    if (isActive !== undefined) target.isActive = Boolean(isActive);
    if (subcategories !== undefined && Array.isArray(subcategories)) target.subcategories = subcategories;
    target.updatedAt = new Date().toISOString();

    dbStore.save();

    logAudit(
      req.user?._id || 'admin',
      req.user?.fullName || 'Admin',
      'admin',
      'CATEGORY_UPDATED',
      'Category',
      target._id,
      `Updated ${targetType} category: ${target.name}`
    );

    return res.json({ success: true, message: 'Category updated successfully.', category: target });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Delete a category
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    let index = dbStore.collection.serviceCategories.findIndex((c) => c._id === id);
    if (index !== -1) {
      const removed = dbStore.collection.serviceCategories.splice(index, 1)[0];
      dbStore.save();
      return res.json({ success: true, message: `Service category "${removed.name}" deleted successfully.` });
    }

    index = dbStore.collection.materialCategories.findIndex((c) => c._id === id);
    if (index !== -1) {
      const removed = dbStore.collection.materialCategories.splice(index, 1)[0];
      dbStore.save();
      return res.json({ success: true, message: `Material category "${removed.name}" deleted successfully.` });
    }

    return res.status(404).json({ success: false, message: 'Category not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
