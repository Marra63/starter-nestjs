import {Body, Controller, Get, Post, Put, Query, Headers, Delete, Req} from '@nestjs/common';
import { AppService } from './app.service';
import {ApiBody, ApiParam, ApiQuery, ApiTags, ApiOperation} from "@nestjs/swagger";
import { Request } from 'express';


@ApiTags("Профессионалы")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get("/getAll")
  getAll():string{
    return this.appService.getAll();
  }


  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'email',
        },
        password: {
          type: 'string',
          description: 'password'
        }
      }
    }
  })
  @ApiOperation({ summary: 'авторизация пользователя' })
  @Post("/signIn")
  checkPassword(@Body() body: any):any{
    //console.log(params)
    return this.appService.checkPassword(body);
  }



  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'email',
        },
        password: {
          type: 'string',
          description: 'password'
        }
      }
    }
  })
  @ApiOperation({ summary: 'авторизация пользователя гугл' })
  @Post("/googleAuth")
  googleAuth(@Body() params: any):any{
    //console.log(params)
    var regexp = new RegExp('gmail')
    if(regexp.test(params.email))
      return this.appService.checkPassword(params);
    else
      return {"message":"fail email"}
  }


  @ApiOperation({ summary: 'регистрация нового пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'full_name',
        },
        phone: {
          type: 'string',
          description: 'phone number'
        },
        email: {
          type: 'string',
          description: 'email address'
        },
        password: {
          type: 'string',
          description: 'password'
        },
      }
    }
  })
  @Post("/signUp")
  postUser(@Body() body:any){
    return this.appService.postUser(body)
  }

  @ApiOperation({ summary: 'регистрация нового пользователя гугл' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'full_name',
        },
        phone: {
          type: 'string',
          description: 'phone number'
        },
        email: {
          type: 'string',
          description: 'email address'
        },
        password: {
          type: 'string',
          description: 'password'
        },
      }
    }
  })
  @Post("/signUpGoogle")
  postUserGoogle(@Body() body:any){
    var regexp = new RegExp('gmail')
    if(regexp.test(body.email))
      return this.appService.postUser(body)
    else
      return {"message":"fail email"}
    }

  @ApiOperation({ summary: 'выход из аккаунта' })
  @Post("/logOut")
  logOut(@Headers('token')token: string){
    return this.appService.postLogOut(token)
  }


  @ApiOperation({ summary: 'получение кода валидации по почте' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'email address'
        }
      }
    }
  })
  @Post("/getValidCode")
  getValidCode(@Body() params: any):any{
    return this.appService.getValidCode( params)
  }

  // @ApiOperation({ summary: 'получение кода валидации по почте повторно' })
  // @ApiQuery({
  //   name: "email",
  //   type:"string",
  //   required:true
  // })
  // @Get("/sendValidCodeAgain")
  // sendValidCodeAgain(  @Query() params: any):any{
  //   return this.appService.sendValidCodeAgain(params)
  // }


  @ApiOperation({ summary: 'проверка кода валидации' })
  @ApiQuery({
    name: "valid_code",
    type:"string",
    required:true
  })
  @ApiQuery({
    name: "email",
    type:"string",
    required:true
  })
  @Get("/checkValidCode")
  checkValidCode(@Query() params:any):any{
    return this.appService.checkValidCode(params)
  }


 @ApiOperation({ summary: 'запрос на изменение пароля' })

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'email address'
        },
        password: {
          type: 'string',
          description: 'password'
        },
        valid_code:{
          type:'number',
          description:"valid code"
        }
      }
    }
  })
  @Put("/changePassword")
  changePassword(@Query() body:any):any{
      return this.appService.changePassword(body)
  }

@ApiOperation({ summary: 'запрос на получение баланса пользователя' })
  @Get("/getBalance")
  getBalance(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.getBalance(token)
  }

@ApiOperation({ summary: 'запрос на добавление заказа' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        origin_details: {
          type: "object",
          properties:{
            address:{
              type:"string"
            },
            country:{
              type:"string"
            },
            phone:{
              type:"string"
            },

          },
          description: 'origin_details',
        },
        delivery_details: {
          type: 'array',
          items:{
            type:"object",
            properties:{
              address:{
                type:"string"
              },
              country:{
                type:"string"
              },
              phone:{
                type:"string"
              },
  
            }
          },
          
          description: 'delivery_details'
        },
        package_details: {
          type: `object`       ,
          properties:{
            items:{
              type:"string"
            },
            weight:{
              type:"number"
            },
            price:{
              type:"number"
            },

          },
          description: 'package_details'
        },
      }
    }
  })

  @Post("/sendPackage")
  postPackage(@Body() body:any,  @Headers('token')token: string):any{
    return this.appService.postPackage(body, token)
  }


// @ApiOperation({ summary: 'запрос на оплату заказа' })
//   @ApiQuery({
//     name: "uuid",
//     type:"string",
//     required:true
//   })
//   @ApiQuery({
//     name: "price",
//     type:"number",
//     required:true
//   })
//   @ApiBody({
//     schema:{
//       type:"object",
//       properties:{
//         charges: {
//           type:"object",
//           properties:{
//             delivery:{
//               type:"number"
//             },
//             tax_and_service:{
//               type:"number"
//             },
//             instant_delivery:{
//               type:"number"
//             },
//           }
//         }
//       }
//     }
//   })
//   @Post("/makePayment")
//   makePayment(@Query() params:any,  @Headers('token')token: string, @Body() body:any):any{
//     return this.appService.makePayment(params, token, body)
//   }


@ApiOperation({ summary: 'запрос на получение последнего uuid' })
@Get("/getLastUUID")
getLastUUID(@Headers('token') token: string):any{
  return this.appService.getLastUUID(token)
}  

  @ApiOperation({ summary: 'запрос на получение истории операций' })
  @Get("/getHistoryOfOperations")
  getHistoryOfOperations(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.getHistoryOfOperations(token)
  }


@ApiOperation({ summary: 'запрос на пополнение баланса' })
  @ApiQuery({
    name: "price",
    type:"string",
    required:true
  })
  @Post("/addMoney")
  addMoney(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.addMoney(params, token)
  }


  @ApiOperation({ summary: 'запрос на изменение статуса заказа' })
  @ApiQuery({
    name: "uuid",
    type:"string",
    required:true
  })
  @ApiQuery({
    name: "state_value",
    type:"string",
    required:true
  })
    @ApiQuery({
    name: "state",
    type:"string",
    required:true
  })
  @Post("/postPackageState")
  postPackageState(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.postPackageState(params, token)
  }

  @ApiOperation({ summary: 'запрос на получение данных о сборах заказа'})
  @ApiQuery({
    name: "uuid",
    type:"string",
    required:true
  })
  @Get("/getCharges")
  getCharges(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.getCharges(params, token)
  }


  @ApiOperation({ summary: 'запрос на получение данных о заказе' })
  @ApiQuery({
    name: "uuid",
    type:"string",
    required:true
  })
  @Get("/getPackageData")
  getPackageData(@Query() params:any,  @Headers('token') token: string):any{
    return this.appService.getPackageData(params, token)
  }

      @ApiOperation({ summary: 'запрос на получение всех заказов пользователя' })
  @Get("/getAllPackages")
  getAllPackages( @Headers('token') token: string):any{
    return this.appService.getAllPackages( token)
  }

  @ApiOperation({ summary: 'запрос для публикации отзыва' })
  @ApiQuery({
    name: "uuid",
    type:"string",
    required:true
  })
  @ApiBody({
    schema:{
      type:"object",
      properties:{
        score:{
          type:"number"
        },
        feedback:{
          type:"string"
        }
      }
    }
  })
  @Post("/postFeedback")
  postFeedback(@Body() body:any,  @Headers('token')token: string, @Query() params:any,):any{
    return this.appService.postFeedback(body, token, params)
  }

/*  @ApiOperation({ summary: 'запрос для получения данных о доставщике' })
  @Get("/getDeliverymen")
  getDeliverymen(@Headers('token') token: string):any{
    return this.appService.getDeliverymen( token)
  }
*/
/*
  @ApiOperation({ summary: 'запрос для добавления сообщения' })
  @ApiQuery({
    name: "uuid",
    type:"string",
    required:true
  })

  @ApiBody({
    schema:{
      type:"object",
      properties:{
        message:{
          type:"string"
        }
      }

    }
  })
 @Post("/postMessage")
  postMessage(@Query() params:any,  @Headers('token') token: string, @Body() body:any,):any{
    return this.appService.postMessage(params, token, body)
  }
*/
  @ApiOperation({ summary: 'запрос для получения данных о пользователе'})
  @Get("/getUserInfo")
  getUserInfo( @Headers('token')token: string):any{
    return this.appService.getUserInfo( token)
  }

  @ApiOperation({ summary: 'запрос для получения данных о рекаламе'})
  @Get("/getAddList")
  getAddList( ):any{
    return this.appService.getAddList( )
  }

  @ApiOperation({ summary: 'запрос для получения данных об аватаре пользователя'})
  @Get("/getUserAvatar")
  getUserAvatar( @Headers('token')token: string):any{
    return this.appService.getUserAvatar( token)
  }

  @ApiOperation({ summary: 'запрос для изменения аватара пользователя'})
  @ApiBody({
    schema:{
      type:"object",
      properties:{
        img:{
          type:"string"
        }
      }

    }
  })

  @Post("/postUserAvatar")
  postUserAvatar( @Headers('token')token: string,  @Body() body:any):any{
    return this.appService.postUserAvatar( token, body)
  }

@ApiOperation({ summary: 'запрос для получения списка пользователей в чате' })
  @Get("/getChatList")
  getListUsers(@Headers('token') token: string):any{
    return this.appService.getListUsers(token)
  }


// @ApiOperation({ summary: 'запрос для получения списка доставщиков' })
//  @Get("/getListDeliveryman")
//   getListDeliveryman(@Headers('token') token: string):any{
//     return this.appService.getListDeliveryman(token)
//   }

  @ApiOperation({ summary: 'запрос для получения данных трека на карте' })
 @Get("/getPoints")
  getPoints():any{
    return [
    [60.008182, 29.723190],
    [59.928842, 34.123707]
    ]
  }


  @ApiOperation({ summary: 'запрос для отправки сообщения' })
  @Post("/postMessage")
  @ApiBody({
    schema:{
      type:"object",
      properties:{
        msg:{
          type:"string"
        },
        id:{
            type:"string"
        }
      }

    }
  })
   postMessage(@Headers('token') token: string, @Body() body:any):any{
        return this.appService.postMessage(token,body)
   }


  // @ApiOperation({ summary: 'запрос для отправки сообщения доставщику' })
  // @Post("/postMessageToDelivaryman")
  // @ApiBody({
  //   schema:{
  //     type:"object",
  //     properties:{
  //       msg:{
  //         type:"string"
  //       },
  //       id:{
  //           type:"string"
  //       }
  //     }

  //   }
  // })
  //  postMessageToDeliveryman(@Headers('token') token: string, @Body() body:any):any{
  //       return this.appService.postMessageToDeliveryman(token,body)
  //  }

  @Delete("/deletePackages")
  deletePackages( @Headers('token')token: string):any{
    return this.appService.deletePackages( token)
  }


  @Delete("/deleteBalance")
  deleteBalance( @Headers('token')token: string):any{
    return this.appService.deleteBalance( token)
  }

  @Delete("/clearUser")
  clearUser( @Headers('token')token: string):any{
    return this.appService.clearUser( token)
  }

  @Delete("/clearUserChat")
  clearUserChat( @Headers('token')token: string):any{
    return this.appService.clearUserChat( token)
  }

  @Delete("/deleteUser")
  deleteUser( @Headers('token')token: string):any{
    return this.appService.deleteUser( token)
  }
  
}
