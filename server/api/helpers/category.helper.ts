
import CategoryModel from '../models/category.model';
class CategoryHelper {
  constructor() {
    //
  }
  /**
   * function for get category by name
   * @param req 
   * @param res 
   * @returns 
   */
  public async getcategoryByName(name: string) {
    try {
      const data: any = await CategoryModel.findOne({
        where: { category_name: name },
        raw: true,
      });
      console.log('BannerInfo:::', data);
      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }

  /**
   * function for add category
   * @param req 
   * @param res 
   * @returns <{message, error}>
   */
  public async add(name: string) {
    try {
      console.log('name:::', name);
      const data: any = await CategoryModel.create({
        category_name: name,
      });
      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }

  /**
   * function for delete category
   * @param req 
   * @param res 
   * @returns
   */

  public async delete(id: number) {
    try {
      console.log('name:::', id);
      const data: any = await CategoryModel.update(
        { is_deleted: 1 },
        { where: { id: id } }
      );
      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }

  /**
   * function for update category
   * @param req 
   * @param res 
   * @returns <{message, error}>
   */
  public async update(category_name: string, id: number) {
    try {
      console.log('name:::', id, category_name);
      const data: any = await CategoryModel.update(
        { category_name: category_name },
        { where: { id: id } }
      );
      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
}

export default new CategoryHelper();
