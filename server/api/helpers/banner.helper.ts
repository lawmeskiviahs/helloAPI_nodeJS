import BannerModel from '../models/bannerImage.model';
class BannerHelper {
  constructor() {
    //
  }

  /**
   * function for save banner
   * @param req 
   * @param res 
   * @returns
   */
  public async save({
    title,
    subTitle,
    imageUrl,
    startDate,
    endDate,
  }: {
    title: string;
    subTitle: string;
    imageUrl: string;
    startDate: Date;
    endDate: Date;
  }) {
    try {
      const BannerInfo: any = await BannerModel.create({
        title,
        subTitle,
        imageUrl,
        startDate,
        endDate,
      });
      if (BannerInfo) {
        return BannerInfo.dataValues;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
     /**
   * function for get banner by title
   * @param req 
   * @param res 
   * @returns 
   */
  public async getBannerByTitle({ title }: { title: string }) {
    try {
      const BannerInfo: any = await BannerModel.findOne({
        where: {
          title,
        },
      });
      if (BannerInfo) {
        return BannerInfo.dataValues;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
       /**
   * function for get banner by id
   * @param req 
   * @param res 
   * @returns 
   */
  public async getBannerById({ bannerImageId }: { bannerImageId: number }) {
    try {
      const BannerInfo: any = await BannerModel.findOne({
        where: {
          bannerImageId,
        },
      });
      if (BannerInfo) {
        return BannerInfo.dataValues;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
  /**
   * function for update banner by id
   * @param req 
   * @param res 
   * @returns 
   */
  public async updateBannerById({
    bannerImageId,
    data,
  }: {
    bannerImageId: number;
    data: any;
  }) {
    try {
      const BannerInfo: any = await BannerModel.update(data, {
        where: { bannerImageId },
      });

      if (BannerInfo) {
        return BannerInfo;
      } else {
        return {};
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
  /**
   * function for get all banner
   * @param req 
   * @param res 
   * @returns 
   */
  public async getAllBanners({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }) {
    try {
      if (offset < 1) {
        offset = 1;
      }
      offset = (offset - 1) * limit;
      console.log('limit: ', limit, 'offset:', offset);
      const BannerInfo: any = await BannerModel.findAndCountAll({
        where: { isActive: 1 },
        attributes: [
          'bannerImageId',
          'title',
          'subTitle',
          'imageUrl',
          'gifImage',
          'isActive',
          'startDate',
          'endDate',
          'isFeatured',
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        raw: true,
      });
      if (BannerInfo) {
        return BannerInfo;
      } else {
        return [];
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }

  /**
   * function for delete banner
   * @param req 
   * @param res 
   * @returns 
   */
  public async deleteBanner({ bannerImageId }: { bannerImageId: number }) {
    try {
      const BannerInfo: any = await BannerModel.destroy({
        where: { bannerImageId: bannerImageId },
      });
      if (BannerInfo > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err: unknown) {
      console.log('err: ', err);
      throw err;
    }
  }
}

export default new BannerHelper();
