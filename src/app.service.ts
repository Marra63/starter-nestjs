import { Injectable } from '@nestjs/common';
import * as DATA from "./data.json";
//import * as DELIVERYMAN from "./deliverymen.json";
import * as fs from 'fs';
import * as USERS from "./users.json"
import { v4 as uuidv4 } from 'uuid';
import { TokenGenerator, TokenBase } from 'ts-token-generator';

@Injectable()
export class AppService {





    getHello(): string {
        return 'Hello World!';
    }

    //получение всех данных
    getAll(): string {
        return JSON.stringify(DATA);
    }

    //аутентификация
    checkPassword(params: any): any {
        let users = JSON.parse(JSON.stringify(DATA));
        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(params.email);


        if (index !== -1 && users[index].password === params.password) {
            return { "message": "success", "token": users[index].token }
        } else {
            return { "message": "fault" }
        }
    }

    //добавление нового пользователя
    postUser(body: any) {

        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(body.email);
        const tokgen = new TokenGenerator();
        body.token = tokgen.generate();
        body.balance = 0
        body.img = ""
        body.chat = {

            "1": {
                "name": "John",
                "surname": "Smith",
                "patronymic": "Ivanov",
                "phone": "+7-(777)-777-77-77",
                "messages": [
                    {
                        "from": "1",
                        "to": body.email,
                        "message": "my name John"
                    }
                ],
                "img": "https://images.dog.ceo/breeds/vizsla/n02100583_2707.jpg"
            },
            "2": {
                "name": "Ivan",
                "surname": "Ivanovich",
                "patronymic": "Ivanov",
                "phone": "+7-(777)-777-77-78",
                "messages": [
                    {
                        "from": "2",
                        "to": body.email,
                        "message": "my name Ivan"
                    }
                ],
                "img": "https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg"
            },
            "3": {
                "name": "Petr",
                "surname": "Petrovich",
                "patronymic": "Ivanov",
                "phone": "+7-(777)-777-77-79",
                "messages": [
                    {
                        "from": "3",
                        "to": body.email,
                        "message": "my name Petr"
                    }
                ],
                "img": "https://images.dog.ceo/breeds/samoyed/n02111889_5932.jpg"
            }

        }
        if (index === -1) {
            DATA.push(body)
        } else {
            DATA[index] = body
        }
        fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
            if (err) throw err;
        });

        return { "token": body.token }

    }

    postLogOut(token: string): any {

        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);
        const tokgen = new TokenGenerator();
        DATA[index].token = tokgen.generate();
        // console.log(DATA[index].token,tokgen.generate() );

        if (index !== -1) {

            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "success" }
        } else {
            return { "message": "fault" }
        }
    }
    //запрос на изменение пароля(получение кода валидации), сервер получает токен
    getValidCode(params: any): any {
        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(params.email);

        if (index !== -1) {
            DATA[index].valid_code = Math.floor(Math.random() * 1000000)
            return { "message": DATA[index].valid_code }
        } else
            return { "message": "invalid email" }
    }

    //сервер получает email, и отправляет код полученный раннее при предыдущем запросе
    sendValidCodeAgain(params: any): any {
        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(params.email);

        if (index !== -1) {
            return { "message": DATA[index].valid_code }
        } else
            return { "message": "invalid email" }
    }

    //сервер получает email и код, при совпадении отправляет сообщение и сохраняет новые данные
    checkValidCode(params: any): any {
        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(params.email);

        //console.log(params)
        //console.log(DATA[index])
        if (index !== -1 && DATA[index].valid_code == params.valid_code) {

            return { "message": "success" }
        } else {
            return { "message": "fault" }
        }

    }

    //сервер получает пароль и почту, и меняет его
    changePassword(body: any): any {
        const index = DATA.map((g) => {
            return g.email;
        }).indexOf(body.email);

        if (index !== -1 && DATA[index].valid_code == body.valid_code) {
            DATA[index].password = body.password
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "success" }
        } else {
            return { "message": "fault" }
        }
    }

    //получение балнса пользователя
    getBalance(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "balance": DATA[index].balance }
        } else {
            return { "message": "fault" }
        }
    }

    //получение UUID, сервер получает token у все параметры посылки, возвращает UUID
    postPackage(body: any, token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        //если есть все неоюхожимые параметры, то вохвращается UUID
        if (index !== -1 && body.origin_details && Array.isArray(body.delivery_details) && body.package_details && body.delivery_details.length!=0 &&
            body.origin_details.address != "" && body.origin_details.country != "" && body.origin_details.phone != "" &&
            Number(body.package_details.weight) && body.package_details.items != "" && Number(body.package_details.price

        ) {
            let uuid = "R-" + uuidv4()
            let obj = {
                "id": uuid,
                "origin_details": body.origin_details,
                "delivery_details": body.delivery_details,
                "package_details": body.package_details,
                "charges": {
                    "delivery": 2701,
                    "instant_delivery": 200,
                    "tax_and_service": 100
                },
                "score": 0,
                "feedback": "",
                "state": {
                    "courier_request": false,
                    "package_ready_for_delivery": false,
                    "package_in_transit": false,
                    "package_delivered": false
                }
            };

            DATA[index].balance -= 3001
            const date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            if (DATA[index].list_payment)
                DATA[index].list_payment.push(
                    {
                        "type": "pay",
                        "sum": 3001,
                        "date": `${day}.${month}.${year}`,
                        "smt": ""
                    }
                )
            else
                DATA[index].list_payment = [
                    {
                        "type": "pay",
                        "sum": 3001,
                        "date": `${day}.${month}.${year}`,
                        "smt": ""
                    }
                ]

            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });

            if (DATA[index].packages)
                DATA[index].packages.push(obj)
            else
                DATA[index].packages = [obj]


            return { "UUID": uuid, "charges": obj.charges }
        } else {
            return { "message": "fault" }
        }

    }

    //оплата заказа
    makePayment(params: any, token: string, body: any): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1 && params.uuid != "" && body.charges) {
            const index_package = DATA[index].packages.map((g) => {
                return g.id;
            }).indexOf(params.uuid);
            if (index_package !== -1) {
                DATA[index].packages[index_package].charges.delivery = body.charges.delivery
                DATA[index].packages[index_package].charges.tax_and_service = body.charges.tax_and_service
                DATA[index].packages[index_package].charges.instant_delivery = body.charges.instant_delivery
                DATA[index].balance -= params.price
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (DATA[index].list_payment)
                    DATA[index].list_payment.push(
                        {
                            "type": "pay",
                            "sum": params.price,
                            "date": `${day}.${month}.${year}`,
                            "smt": ""
                        }
                    )
                else
                    DATA[index].list_payment = [
                        {
                            "type": "pay",
                            "sum": params.price,
                            "date": `${day}.${month}.${year}`,
                            "smt": ""
                        }
                    ]

                fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                    if (err) throw err;
                });
                return { "message": "successful" }
            } else {
                return { "message": "fault uuid" }
            }

        } else {
            return { "message": "fault" }
        }

    }

    //история операций
    getHistoryOfOperations(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "list_payment": DATA[index].list_payment }
        } else {
            return { "message": "fault" }
        }

    }

    //история операций
    getAllPackages(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "packages": DATA[index].packages }
        } else {
            return { "message": "fault" }
        }

    }

    //пополнение кошелька
    addMoney(params: any, token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index].balance += Number(params.price)
            const date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            if (DATA[index].list_payment)
                DATA[index].list_payment.push(
                    {
                        "type": "add",
                        "sum": params.price,
                        "date": `${day}.${month}.${year}`,
                        "smt": ""
                    }
                )
            else
                DATA[index].list_payment = [
                    {
                        "type": "pay",
                        "sum": params.price,
                        "date": `${day}.${month}.${year}`,
                        "smt": ""
                    }
                ]

            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }
    }

    //изменение статуса заказа
    postPackageState(params: any, token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1 && params.uuid != "") {
            const index_package = DATA[index].packages.map((g) => {
                return g.id;
            }).indexOf(params.uuid);
            if (index_package !== -1) {
                switch (params.state) {
                    case "courier_request": {
                        DATA[index].packages[index_package].state.courier_request = (params.state_value === "true")
                        break;
                    }
                    case "package_ready_for_delivery": {
                        DATA[index].packages[index_package].state.package_ready_for_delivery = (params.state_value === "true")
                        break;
                    }
                    case "package_in_transit": {
                        DATA[index].packages[index_package].state.package_in_transit = (params.state_value === "true")
                        break;
                    }
                    case "package_delivered": {
                        DATA[index].packages[index_package].state.package_delivered = (params.state_value === "true")
                        break;
                    }


                }
                fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                    if (err) throw err;
                });
                return { "message": "successful" }
            } else {
                return { "message": "fault" }
            }
        } else {
            return { "message": "fault" }
        }

    }

    //получение сборов
    getCharges(params: any, token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1 && params.uuid != "") {
            const index_package = DATA[index].packages.map((g) => {
                return g.id;
            }).indexOf(params.uuid);
            if (index_package !== -1) {
                return { "charges": DATA[index].packages[index_package].charges }
            } else {
                return { "message": "fault" }
            }
        } else {
            return { "message": "fault" }
        }
    }

    //получение данных о заказе
    getPackageData(params: any, token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1 && params.uuid != "") {
            const index_package = DATA[index].packages.map((g) => {
                return g.id;
            }).indexOf(params.uuid);
            if (index_package !== -1) {
                return { "package": DATA[index].packages[index_package] }
            } else {
                return { "message": "fault" }
            }
        } else {
            return { "message": "fault" }
        }
    }

    //отправка оценки и отзова
    postFeedback(body: any, token: string, params: any): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1 && params.uuid != "") {
            const index_package = DATA[index].packages.map((g) => {
                return g.id;
            }).indexOf(params.uuid);
            if (index_package !== -1) {
                DATA[index].packages[index_package].score = Number(body.score)
                DATA[index].packages[index_package].feedback = body.feedback
                fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                    if (err) throw err;
                });
                return { "message": "successful" }
            } else {
                return { "message": "fault" }
            }
        } else {
            return { "message": "fault" }
        }
    }
    /*
        //все доставшики по юзеру
        getDeliverymen(token: string):any{
            const index = DATA.map((g) => {
                return g.token;
            }).indexOf(token);
    
            if(index!==-1){
                if(DATA[index].packages)
                    return DATA[index].packages.map( e => [e.id,DELIVERYMAN[e.deliveryman]] )
            }
        }
    */
    //отправка сообщения
    // postMessage(params:any,token:string,body:any):any{
    //     const index = DATA.map((g) => {
    //         return g.token;
    //     }).indexOf(token);

    //     if (index !== -1 && params.uuid != "") {
    //         const index_package = DATA[index].packages.map((g) => {
    //             return g.id;
    //         }).indexOf(params.uuid);

    //         if (index_package !== -1) {

    //             //DATA[index].packages[index_package].list_mes.push(body.message.toString())

    //             fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
    //                 if (err) throw err;
    //             });
    //             return {"message": "successful"}
    //         } else {
    //             return {"message": "fault"}
    //         }
    //     } else {
    //         return {"message": "fault"}
    //     }

    // }

    //данные о пользователе
    getUserInfo(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "user": DATA[index] }
        } else {
            return "no user"
        }
    }

    //получение рекламы
    getAddList(): any {
        return ["https://cdn.thedogapi.com/images/Hylo4Snaf.jpeg", "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg", "https://cdn2.thecatapi.com/images/ozEvzdVM-.jpg"]
    }

    //получение аватарки
    getUserAvatar(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "user": DATA[index].img }
        } else {
            return "no user"
        }
    }

    //изменение аватарки
    postUserAvatar(token: string, body: any): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index].img = body.img
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }
    }

    //очистка заказов
    deletePackages(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index].packages = []
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }
    }

    //очистка баланса
    deleteBalance(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index].list_payment = []
            DATA[index].balance = 0
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }
    }

    //очистка пользователя
    clearUser(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index] = {
                "token": token,
                "name": DATA[index].name,
                "email": DATA[index].email,
                "password": DATA[index].password,
                "phone": "+7-(777)-777-77-77",
                "valid_code": 0,
                "balance": 0,
                "img": "",
                "list_payment": [],
                "packages": [],
                "chat": {

                    "1": {
                        "name": "John",
                        "surname": "Smith",
                        "patronymic": "Ivanov",
                        "phone": "+7-(777)-777-77-77",
                        "messages": [
                            {
                                "from": "1",
                                "to": DATA[index].email,
                                "message": "my name John"
                            }
                        ],
                        "img": "https://images.dog.ceo/breeds/vizsla/n02100583_2707.jpg"
                    },
                    "2": {
                        "name": "Ivan",
                        "surname": "Ivanovich",
                        "patronymic": "Ivanov",
                        "phone": "+7-(777)-777-77-78",
                        "messages": [
                            {
                                "from": "2",
                                "to": DATA[index].email,
                                "message": "my name Ivan"
                            }
                        ],
                        "img": "https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg"
                    },
                    "3": {
                        "name": "Petr",
                        "surname": "Petrovich",
                        "patronymic": "Ivanov",
                        "phone": "+7-(777)-777-77-79",
                        "messages": [
                            {
                                "from": "3",
                                "to": DATA[index].email,
                                "message": "my name Petr"
                            }
                        ],
                        "img": "https://images.dog.ceo/breeds/samoyed/n02111889_5932.jpg"
                    }

                }
            }
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }

    }

    clearUserChat(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA[index].chat = {

                "1": {
                    "name": "John",
                    "surname": "Smith",
                    "patronymic": "Ivanov",
                    "phone": "+7-(777)-777-77-77",
                    "messages": [
                        {
                            "from": "1",
                            "to": DATA[index].email,
                            "message": "my name John"
                        }
                    ],
                    "img": "https://images.dog.ceo/breeds/vizsla/n02100583_2707.jpg"
                },
                "2": {
                    "name": "Ivan",
                    "surname": "Ivanovich",
                    "patronymic": "Ivanov",
                    "phone": "+7-(777)-777-77-78",
                    "messages": [
                        {
                            "from": "2",
                            "to": DATA[index].email,
                            "message": "my name Ivan"
                        }
                    ],
                    "img": "https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg"
                },
                "3": {
                    "name": "Petr",
                    "surname": "Petrovich",
                    "patronymic": "Ivanov",
                    "phone": "+7-(777)-777-77-79",
                    "messages": [
                        {
                            "from": "3",
                            "to": DATA[index].email,
                            "message": "my name Petr"
                        }
                    ],
                    "img": "https://images.dog.ceo/breeds/samoyed/n02111889_5932.jpg"
                }

            }

            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }


    }


    deleteUser(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            DATA.splice(index);
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "successful" }
        } else {
            return { "message": "fault" }
        }


    }
    getListUsers(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);
        if (index !== -1) {
            return DATA[index].chat
        }
        return []
    }

    // getListDeliveryman(token: string): any {
    //     const index = DATA.map((g) => {
    //         return g.token;
    //     }).indexOf(token);
    //     if (index !== -1) {
    //         return DATA[index].chat.deliveryman
    //     }
    //     return []
    // }

    postMessage(token: string, body: any): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);
        if (index !== -1 && DATA[index].chat[body.id]) {
            DATA[index].chat[body.id].messages.push(
                {
                    "from": DATA[index].email,
                    "to": body.id,
                    "message": body.msg
                }
            )
            fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
                if (err) throw err;
            });
            return { "message": "true" }
        } else
            return { "message": "false" }
    }

    //  postMessageToDeliveryman(token:string, body:any):any{
    //     const index = DATA.map((g) => {
    //         return g.token;
    //     }).indexOf(token);
    //     if(index!==-1 && DATA[index].chat.deliveryman[body.id]){
    //         DATA[index].chat.deliveryman[body.id].messages.push(body.msg)
    //         fs.writeFile('src/data.json', JSON.stringify(DATA), (err) => {
    //             if (err) throw err;
    //         });
    //         return {"message":"true"}
    //     }else
    //         return {"message":"false"}
    // }

    getLastUUID(token: string): any {
        const index = DATA.map((g) => {
            return g.token;
        }).indexOf(token);

        if (index !== -1) {
            return { "uuid": DATA[index].packages[DATA[index].packages.length - 1] }
        } else {
            return "error"
        }
    }
}

