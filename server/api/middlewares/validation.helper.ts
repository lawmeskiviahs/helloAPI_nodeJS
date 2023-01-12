import { NextFunction, Request, Response } from 'express';
import SetResponse from '../response/response.helper';
import { MESSAGES } from '../../api/constant/response.messages';
import { RESPONSES } from '../../api/constant/response';
import * as joiOptions from '../constant/joi.validation';
// import JoiPasswordComplexity from 'joi-password';
import Joi, { object } from 'joi';
// import * as Interfaces from '../../api/interfaces';

const options = {
  // available options
  // dns: dns server ip address or hostname (string),
  // port: dns server port (number),
  // recursive: Recursion Desired flag (boolean, default true, since > v1.4.2)
};
export class ValidationHandler {
  /* Add Subscription plans */
  plansAdd = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        planName: Joi.string().trim().required(),
        planAmount: Joi.number().min(1).required(),
        description: Joi.string().trim().min(3).required(),
        isFeatured: Joi.number().min(0).max(1),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
  validatephotographer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        userid: Joi.string().required(),
        status: Joi.number().required(),
        comment: Joi.string().allow(null, ''),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  addCreatorValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      console.log('checking validation ...');
      const transSchema = Joi.object({
        fullname: Joi.string()
          .required()
          .regex(/^[a-zA-Z ]+$/)
          .message('Name must be characters.'), ///^[a-zA-Z][a-zA-Z\\s]+$/
        email: Joi.string().email().trim().required(),
        publicEthAddress: Joi.string().trim().allow(null, ''), // allow
        bio: Joi.string().allow(null, ''),
        website: Joi.string().trim().allow(null, ''),
        username: Joi.string().trim().min(3).max(50).required().regex(/^[a-zA-Z0-9-_]+$/).message("Not valid Username"),
        users_url: Joi.string().trim().allow(null, ''),
        mobile_no: Joi.string().min(10).max(13).allow(null, ''), //allow
        date_of_birth: Joi.date().allow(null, ''),
        countryName: Joi.string().trim().max(200).allow(null, ''),
        countryId: Joi.string().trim().allow(null, ''),
        stateId: Joi.string().trim().allow(null, ''),
        state: Joi.string().trim().max(50).allow(null, ''),
        cityId: Joi.string().trim().allow(null, ''),
        city: Joi.string().min(3).max(30).allow(null, ''),
        address: Joi.string().max(500).allow(null, ''),
        postalCode: Joi.string().allow(null, ''),
        profileImage: Joi.string().trim().allow(null, ''),
        coverImage: Joi.string().trim().allow(null, ''),
        twitterId: Joi.string().trim().allow(null, ''),
        isTwitterToggled: Joi.number().allow(null, ''),
        instagramId: Joi.string().trim().allow(null, ''),
        isInstagramToggled: Joi.number().allow(null, ''),
        tiktokId: Joi.string().trim().allow(null, ''),
        isTikTokToggled: Joi.number().allow(null, ''),
        facebookId: Joi.string().trim().allow(null, ''),
        isFacebookToggled: Joi.number().allow(null, ''),
        onlyfansId: Joi.string().trim().allow(null, ''),
        isOnlyFansToggled: Joi.number().allow(null, ''),
        createdByAdmin: Joi.bool().allow(null, ''),
        role_type: Joi.number().required(),
        mintWebsite: Joi.string().allow(null, ''),
        nftCollection: Joi.array()
          .items(
            Joi.string()
              .regex(
                /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
              )
              .message('External link valid..')
          )
          .allow(null, ''),
        dial_code: Joi.string().allow(null, ''),
        comment: Joi.string().allow(null, ''),
        document_front: Joi.string().allow(null, ''),
        document_back: Joi.string().allow(null, ''),
        documentType: Joi.string().allow(null, ''),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error) {
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      }

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  collectionValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      let transSchema2: any;
      let reqQuery: any;
      console.log('reqParam', reqParam);

      if (Object.keys(reqParam).length > 0) {
        let paramSchema = Joi.object({
          id: Joi.string()
            .required()
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      let reqBody = req.body;
      if (Object.keys(reqBody).length > 0) {
        const transSchema = Joi.object({
          name: Joi.string().trim().required(),
          logo: Joi.string().trim().required(),
          banner: Joi.string().trim().required(),
          featuredImage: Joi.string().trim().required(),
          royalty: Joi.number().required(),
          collectionUrl: Joi.string().trim().required().regex(/^[a-zA-Z0-9-]+$/).message("Not valid CollectionUrl"),
          externalLink: Joi.string().trim().allow(null, ''),
          description: Joi.string().trim().optional(),
          blockChainId: Joi.number().required(),
          categoryId: Joi.string().required(),
          sensitiveContent: Joi.bool().optional(),
          isFeatured: Joi.bool().allow(null, ''),
        });

        const { error } = transSchema.validate(reqBody, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      if (Object.keys(req.query).length) {
        console.log('inside the query check.');
        reqQuery = req.query;
        console.log('inside req.query', reqQuery);
        transSchema2 = Joi.object({
          limit: Joi.number().allow(null, ''),
          offset: Joi.number().allow(null, ''),
          searchText: Joi.string().allow(null, ''),
          sortBy: Joi.string().allow(null, ''),
          Admin: Joi.bool().allow(null, ''),
          type: Joi.string().allow(null, ''),
          fromAdmin: Joi.bool().allow(null, ''),
          creatorId: Joi.string().allow(null, ''),
          year: Joi.string().allow(null, ''),
        });

        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  collectionUpdateValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      console.log('reqParam', reqParam);

      if (Object.keys(reqParam).length > 0) {
        let paramSchema = Joi.object({
          collectionUrl: Joi.string().trim().required(),
          // id: Joi.string()
          //   .required()
          //   .regex(
          //     /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
          //   )
          //   .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      let reqBody = req.body;
      if (Object.keys(reqBody).length > 0) {
        const transSchema = Joi.object({
          name: Joi.string().trim().allow(null, ''),
          logo: Joi.string().trim().allow(null, ''),
          banner: Joi.string().trim().allow(null, ''),
          featuredImage: Joi.string().trim().allow(null, ''),
          royalty: Joi.number().allow(),
          collectionUrl: Joi.string().trim().allow(null, ''),
          externalLink: Joi.string().trim().allow(null, ''),
          description: Joi.string().trim().allow(null, ''),
          blockChainId: Joi.number().allow(),
          categoryId: Joi.string().allow(),
          sensitiveContent: Joi.bool().allow(null, ''),
          isFeatured: Joi.bool().allow(null, ''),
        });

        const { error } = transSchema.validate(reqBody, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  categoryValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      console.log('reqParam', reqParam);

      if (Object.keys(reqParam).length > 0) {
        let paramSchema = Joi.object({
          id: Joi.string()
            .required()
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      const reqBody = req.body;
      if (Object.keys(reqBody).length > 0) {
        let transSchema = Joi.object({
          category_name: Joi.string().trim().required(),
          category_image: Joi.string().trim().optional().allow(''),
          is_featured: Joi.bool().optional(),
        });

        const { error } = transSchema.validate(reqBody, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      return next();
    } catch (error: any) {
      return SetResponse.error(
        res,
        error.status ? error.status : RESPONSES.BADREQUEST,
        {
          message: error.message,
          error: error.error ? error.error : true,
        }
      );
    }
  };

  postValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        user_Id: Joi.string().trim().required(),
        nft_id: Joi.string().trim().optional(),
        content: Joi.string().trim().optional(),
        is_hidden: Joi.bool().optional(),
        is_active: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  likeValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        parent_id: Joi.string().trim().required(),
        user_id: Joi.string().trim().required(),
        source: Joi.string().required(),
        is_active: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  commentValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        parent_id: Joi.string().trim().default('null'),
        user_id: Joi.string().trim().required(),
        post_id: Joi.string().required(),
        text: Joi.string().required(),
        image: Joi.string().required(),
        is_active: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  idParamsValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      if (Object.keys(reqParam).length > 0) {
        let paramSchema = Joi.object({
          id: Joi.string()
            .required()
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      let reqBody = req.body;
      console.log('reqBody', reqBody);

      if (Object.keys(reqBody).length > 0) {
        const transSchema = Joi.object({
          // fullname: Joi.string().allow(null, ''),
          fullname: Joi.string()
          .trim().allow(null, '')
          .regex(/^[a-zA-Z ]+$/)
          .message('Name must be characters.'), ///^[a-zA-Z][a-zA-Z\\s]+$/
          email: Joi.string().email().trim().allow(null, ''),
          publicEthAddress: Joi.string().trim().allow(null, ''),
          bio: Joi.string().allow(null, ''),
          website: Joi.string().allow(null, ''),
          username: Joi.string().trim().min(3).max(50).required().regex(/^[a-zA-Z0-9-_]+$/).message("Not valid Username"),
          users_url: Joi.string().trim().allow(null, ''),
          mobile_no: Joi.string().trim().allow(null, ''),
          date_of_birth: Joi.date().allow(null, ''),
          countryName: Joi.string().allow(null, ''),
          countryId: Joi.string().allow(null, ''),
          stateId: Joi.string().allow(null, ''),
          state: Joi.string().allow(null, ''),
          cityId: Joi.string().allow(null, ''),
          city: Joi.string().allow(null, ''),
          address: Joi.string().allow(null, ''),
          postalCode: Joi.string().allow(null, ''),
          profileImage: Joi.string().allow(null, ''),
          coverImage: Joi.string().allow(null, ''),
          twitterId: Joi.string().allow(null, ''),
          isTwitterToggled: Joi.number().allow(null, ''),
          instagramId: Joi.string().allow(null, ''),
          isInstagramToggled: Joi.number().allow(null, ''),
          tiktokId: Joi.string().allow(null, ''),
          isTikTokToggled: Joi.number().allow(null, ''),
          facebookId: Joi.string().allow(null, ''),
          isFacebookToggled: Joi.number().allow(null, ''),
          onlyfansId: Joi.string().allow(null, ''),
          isOnlyFansToggled: Joi.number().allow(null, ''),
          createdByAdmin: Joi.bool().allow(null, ''),
          MintWebsite: Joi.string().allow(null, ''),
          role_type: Joi.number().required(),
          nftCollection: Joi.array().items(Joi.string()).allow(null, ''),
          dial_code: Joi.string().allow(null, ''),
          comment: Joi.string().allow(null, ''),
          document_front: Joi.string().allow(null, ''),
          document_back: Joi.string().allow(null, ''),
          documentType: Joi.string().allow(null, ''),
        });

        const { error } = transSchema.validate(reqBody, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  updateValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      if (reqParam) {
        let paramSchema = Joi.object({
          id: Joi.string()
            .required()
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      let reqBody = req.body;
      const transSchema = Joi.object({
        isFeatured: Joi.bool().allow(null, ''),
        isMoreCreator: Joi.bool().allow(null, ''),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  paginationAndFilterCollectionValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let transSchema2: any;
      let reqParam;
      let reqQuery;
      reqParam = req.params;
      console.log('inside req.params', reqParam);
      transSchema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
      });
      if (req.query) {
        reqQuery = req.query;
        console.log('inside req.query', reqQuery);
        transSchema2 = Joi.object({
          searchText: Joi.string().allow(),
          sortBy: Joi.string().allow(),
          fromAdmin: Joi.bool().allow(),
        });
      }

      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      if (req.query) {
        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  // CollectionByIdValidation = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     let reqParam = req.params;
  //     if(reqParam){
  //       let paramSchema = Joi.object({
  //         collectionId: Joi.string().required().regex(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/).message("ID did  not found"),
  //       });

  //       const { error } = paramSchema.validate(reqParam, joiOptions.options);
  //       if (error)
  //         throw {
  //           message: joiOptions.capitalize(error.details[0].message),
  //         };
  //     }
  //     return next();
  //   } catch (error: any) {
  //     console.log(error);
  //     return SetResponse.error(res, 401, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };

  // categoryByIdValidation = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     let reqParam = req.params;
  //     if(reqParam){
  //       let paramSchema = Joi.object({
  //         id: Joi.string().required().regex(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/).message("ID did  not found"),
  //       });

  //       const { error } = paramSchema.validate(reqParam, joiOptions.options);
  //       if (error)
  //         throw {
  //           message: joiOptions.capitalize(error.details[0].message),
  //         };
  //     }
  //     return next();
  //   } catch (error: any) {
  //     console.log(error);
  //     return SetResponse.error(res, 401, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };

  paginationCategoryValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let transSchema2: any;
      let reqParam;
      reqParam = req.params;
      console.log('inside req.params', reqParam);
      transSchema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
      });
      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      let reqQuery = req.query;
      console.log('inside req.query', reqQuery);
      if (Object.keys(reqQuery).length > 0) {
        transSchema2 = Joi.object({
          filter: Joi.string().allow(null, ''),
          setting: Joi.bool().optional()
        });

        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  paginationAndFilterValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let transSchema2: any;
      let reqParam;
      let reqQuery;
      reqParam = req.params;
      if (Object.keys(reqParam).length > 0) {
        console.log('inside req.params', reqParam);
        transSchema = Joi.object({
          limit: Joi.number().required(),
          offset: Joi.number().required(),
          role_type: Joi.number().allow(null, ''),
          id: Joi.string().allow(),
        });
        const { error } = transSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      reqQuery = req.query;
      console.log('inside req.query', reqQuery);
      if (Object.keys(reqQuery).length > 0) {
        transSchema2 = Joi.object({
          searchText: Joi.string().allow(null, ''),
          sortBy: Joi.string().allow(null, ''),
          role_type: Joi.number().allow(),
          fromAdmin: Joi.bool().allow(),
          filter: Joi.string().allow(null, ''),
          status: Joi.string().allow(null, ''),
          publicEthAddress: Joi.string().allow(null, ''),
        });

        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  editUserValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqParam = req.params;
      if (Object.keys(reqParam).length > 0) {
        let paramSchema = Joi.object({
          id: Joi.string()
            .required()
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
        });

        const { error } = paramSchema.validate(reqParam, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }

      let reqBody = req.body;
      console.log('reqBody', reqBody);

      if (Object.keys(reqBody).length > 0) {
        const transSchema = Joi.object({
          isActive: Joi.bool().required(),
        });

        const { error } = transSchema.validate(reqBody, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  adminBannerValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        banner: Joi.string().required(),
        isFeatured: Joi.bool().optional(),
        isActive: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  adminFeesValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        fees: Joi.number().min(0.01).max(1.5).required(),
        types: Joi.string().trim().optional(),
        is_active: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  adminRoyaltyValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        royalty: Joi.number().min(1).max(10).required(),
        types: Joi.string().trim().optional(),
        is_active: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
}

export default new ValidationHandler();
