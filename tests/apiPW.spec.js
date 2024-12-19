import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { SecretToken } from "../src/helperForApi/helper";

test.describe.only("API challenge", () => {
  let URL = "https://apichallenges.herokuapp.com/";
  let token;
  let id;
  let firstId;
  let secondId;
  let payload;

  test.beforeAll(async ({ request }) => {
    let response = await request.post(`${URL}challenger`);
    let headers = response.headers();
    token = headers["x-challenger"];
  
    expect(headers).toEqual(
      expect.objectContaining({ "x-challenger": expect.any(String) }),
    );

    console.log(token);
  });

  test("Получить список заданий GET /challenges (200) @GET", async ({ request }) => {
    let response = await request.get(`${URL}challenges`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body.challenges.length).toBe(59);

  });

  test("Выполнить запрос GET /todos @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    let headers = await response.headers();
    id = body.todos[0].id;

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body.todos.length).toBe(10);

  });

  test("Выполнить запрос GET /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todo`, {
      headers: {
        "x-challenger": token,
      },
    });
    let headers = await response.headers();

    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Вернуть определенную задачу GET /todos/{id} @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos/${id}`, {
      headers: {
        "x-challenger": token,
      },
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
 
  });


  test("Вернуть задачу, которой не существует GET /todos/{id} @GET", async ({ request }) => {
    let id2 = 122;
    let response = await request.get(`${URL}todos/${id2}`, {
      headers: {
        "x-challenger": token,
      },
    });

    let headers = await response.headers();

    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
 
  });

  test("Выполнить запрос HEAD /todos @HEAD", async ({ request }) => {
    let response = await request.head(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });


  test("Создание задачи POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio()
      }
    });
    
    let headers = await response.headers();
    let body = await response.json();
    firstId = body.id;
  
    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      doneStatus: true,
      description: expect.any(String)
    }));

  });


  test("Создание задачи с некорретным статусом POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: 'truss',
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })


  test("Создание задачи с длинным названием POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.word.words(12),
        doneStatus: true,
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Создание задачи с длинным описанием POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.word.words(50)
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });
  

  test("Создание задачи с полями заголовка и описания максимальной длины POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.string.alpha(50),
        doneStatus: true,
        description: faker.string.alpha(200)
      }
    });
   
    let headers = await response.headers();
    let body = await response.json();
    secondId = body.id;
  
    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      doneStatus: true,
      description: expect.any(String)
    }));

  })

  test("Создание задачи, в которой слишком длинный контент POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.string.alpha(5000),
        doneStatus: true,
        description: faker.string.alpha(200)
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(413);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });


  test("Создание задачи, в которой содержатся нераспознанные поля POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        priority: true,
        doneStatus: true,
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Вернуть задачи, статус которых выполнен GET todos/doneStatus=true @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos?doneStatus=true`, {
       headers: {
        "x-challenger": token,
     },
    });

    let headers = await response.headers();
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
 
   });

   test("Создание задачи через PUT /todos @PUT", async ({ request }) => {
    let response = await request.put(`${URL}todos/${faker.number.int(1000)}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.string.alpha(50),
        doneStatus: true,
        description: faker.string.alpha(200)
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Обновление задачи POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos/${firstId}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Обновление для несуществующей задачи POST /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos/125`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(404);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Обновление существующей задачи PUT /todos @PUT", async ({ request }) => {
    let response = await request.put(`${URL}todos/${firstId}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio(),
        doneStatus: false,
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
    let body = await response.json();
    
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      doneStatus: false,
      description: expect.any(String)
    }));

  });

  test("Частичное обновление существующей задачи (только название) PUT /todos @PUT", async ({ request }) => {
    let response = await request.put(`${URL}todos/${secondId}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        title: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
    let body = await response.json();
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      doneStatus: false,
      description: expect.any(String)
    }));

  })


test("Обновление существующей задачи без названия PUT /todos @PUT", async ({ request }) => {
    let response = await request.put(`${URL}todos/${firstId}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        doneStatus: true,
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
  })

  test("Обновление существующей задачи с другим id PUT /todos @PUT", async ({ request }) => {
    let response = await request.put(`${URL}todos/${firstId}`, {
      headers: {
        "x-challenger": token,
      },
      data: {
        id: 125,
        title: faker.person.bio(),
        doneStatus: false,
        description: faker.person.bio()
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(400);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
  });


  test("Удаление задачи DELET /todos @DELET", async ({ request }) => {
    let response = await request.delete(`${URL}todos/${firstId}`, {
      headers: {
        "x-challenger": token,
      }
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Запрос OPTION /todos @OPTION", async ({ request }) => {
    let response = await request.fetch(`${URL}todos`, {
      method: "OPTIONS",
      headers: {
        "x-challenger": token,
      }
      
    });
   
    let headers = await response.headers();
  
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Выполнить запрос GET в xml /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/xml"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/xml');
  });


  test("Выполнить запрос GET в json /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/json');
  });


  test("Выполнить запрос GET в любом формате /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "*/*"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/json');
  });
 

  test("Выполнить запрос GET в форматах xml(предпочтительны формарт),json  /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/xml, application/json"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/xml');
  });


  test("Выполнить запрос GET без заголовка Accept /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": ""
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/json');
  });

  test("Выполнить запрос GET с заголовком 'application/gzip'  /todo @GET", async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/gzip"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(406);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Создание задачи POST в xml формате /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/xml",
        "content-type": "application/xml"
      },
      data: `
        <title>${faker.person.bio()}</title>
        <doneStatus>true</doneStatus>
        <description>${faker.person.bio()}</description>
        `
      
    });
    
    let headers = await response.headers();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(headers['content-type']).toEqual('application/xml');

  })

  test("Создание задачи POST в json формате /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json"
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio()
      }
    });
    
    let headers = await response.headers();
    let body = await response.json();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      doneStatus: true,
      description: expect.any(String)
    }));
    expect(headers['content-type']).toEqual('application/json');

  })

  test("Создание задачи POST в некорректном формате /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
        "content-type": "application/gzip"
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio()
      }
    });
    
    let headers = await response.headers();

    expect(response.status()).toBe(415);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  })

  test("Выполнить запрос GET /challenger/guid @GET", async ({ request }) => {
    let response = await request.get(`${URL}challenger/${token}`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Выполнить запрос PUT /challenger/guid @PUT", async ({ request }) => {
    let getRequest = await request.get(`${URL}challenger/${token}`, {
      headers: {
        "x-challenger": token
      }
    });

    let getBody = await getRequest.json();


    let response = await request.put(`${URL}challenger/${token}`, {
      headers: {
        "x-challenger": token
      },
      data:getBody
    });

    let headers = await response.headers();
    payload = await response.json();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Выпонить запрос PUT /challenger/guid  @PUT", async ({ request }) => {
    await request.put(`${URL}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: {}
    });

    let response = await request.put(`${URL}challenger/${token}`, {
      headers: {
        "x-challenger": token,
      },
      data: payload
    });
    let headers = response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));
  });


  test("Выполнить запрос GET /challenger/database/guid @GET", async ({ request }) => {
    let response = await request.get(`${URL}challenger/database/${token}`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });


  test("Выполнить запрос PUT /challenger/database/guid @PUT", async ({ request }) => {
    let getRequest = await request.get(`${URL}challenger/database/${token}`, {
      headers: {
        "x-challenger": token
      }
    });

    let getBody = await getRequest.json();


    let response = await request.put(`${URL}challenger/database/${token}`, {
      headers: {
        "x-challenger": token
      },
      data:getBody
    });

    let headers = await response.headers();

    expect(response.status()).toBe(204);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });


  test("Выполнить запрос POST чтобы создать задачу, используя Content-Type 'application/xml', но принимая 'application/json' /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
        "content-type": "application/xml"
      },
      data: `
        <title>${faker.person.bio()}</title>
        <doneStatus>true</doneStatus>
        <description>${faker.person.bio()}</description>
        `
      
    });

    let headers = await response.headers();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Выполнить запрос POST чтобы создать задачу, используя Content-Type 'application/json', но принимая 'application/xml' /todos @POST", async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/xml",
        "content-type": "application/json"
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio()
      }
      
    });

    let headers = await response.headers();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ 'x-challenger': token}));

  });

  test("Выполнить запрос DELETE /heartbeat @DELETE", async ({ request }) => {
    let response = await request.delete(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(405);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });

  test("Выполнить запрос PATCH /heartbeat @PATCH", async ({ request }) => {
    let response = await request.patch(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(500);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос TRACE /heartbeat @TRACE", async ({ request }) => {
    let response = await request.fetch(`${URL}heartbeat`, {
      method: "TRACE",

      headers: {
        "x-challenger": token
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(501);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });

  test("Выполнить запрос GET /heartbeat @GET", async ({ request }) => {
    let response = await request.get(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(204);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /heartbeat как DELETE  @POST", async ({ request }) => {
    let response = await request.post(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "DELETE"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(405);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });
  

  test("Выполнить запрос POST /heartbeat как PATCH  @POST", async ({ request }) => {
    let response = await request.post(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "PATCH"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(500);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /heartbeat как TRACE  @POST", async ({ request }) => {
    let response = await request.post(`${URL}heartbeat`, {
      headers: {
        "x-challenger": token,
        "X-HTTP-Method-Override": "TRACE"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(501);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /secret/token неверный admin/password @POST", async ({ request }) => {
    let response = await request.post(`${URL}secret/token`, {
      headers: {
        "x-challenger": token,
        "authorization": "Basic YWRtaW46cGFzc3dvcmQxMTE="
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(401);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /secret/token верный admin/password @POST", async ({ request }) => {
    let response = await request.post(`${URL}secret/token`, {
      headers: {
        "x-challenger": token,
        "authorization": "Basic YWRtaW46cGFzc3dvcmQ="
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос GET /secret/note c некорретным токеном @GET", async ({ request }) => {
    let response = await request.get(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
         "X-AUTH-TOKEN":"skf548"
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(403);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });

  test("Выполнить запрос GET /secret/note без X-AUTH-TOKEN @GET", async ({ request }) => {
    let response = await request.get(`${URL}secret/note`, {
      headers: {
        "x-challenger": token
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(401);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос GET /secret/note c корретным токеном @GET", async ({ request }) => {

    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.get(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
        "X-AUTH-TOKEN": secretToken
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /secret/note @POST", async ({ request }) => {

    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.post(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json",
        "X-AUTH-TOKEN": secretToken
      },
      data: {
        note:faker.person.bio()
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });



  test("Выполнить запрос POST /secret/note, если X-AUTH-TOKEN отсутствует @POST", async ({ request }) => {

    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.post(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "Accept": "application/json"
      },
      data: {
        note:faker.person.bio()
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(401);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  })


  test("Выполнить запрос POST /secret/note, если X-AUTH-TOKEN некорректный @POST", async ({ request }) => {

    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.post(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "X-AUTH-TOKEN": "sdddd"

      },
      data: {
        note:faker.person.bio()
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(403);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  })


  test("Выполнить запрос GET /secret/note  при использовании значения X-AUTH-TOKEN в качестве токена носителя авторизации  @GET", async ({ request }) => {
    
    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.get(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "Authorization":`Bearer ${secretToken}`

      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос POST /secret/note, если в качестве токена носителя авторизации используется допустимое значение X-AUTH-TOKEN  @POST", async ({ request }) => {

    let secret = new SecretToken(request);
    let secretToken = await secret.getSecretToken(token);

    let response = await request.post(`${URL}secret/note`, {
      headers: {
        "x-challenger": token,
        "Authorization":`Bearer ${secretToken}`
      },
      data: {
        note:faker.person.bio()
      }
    });

    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

  });


  test("Выполнить запрос DELETE все записи /todos/{id} @DELETE", async ({ request }) => {
    let responseTodos = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });

    let idNum = (await responseTodos.json())['todos']

    for (let index = 0; index < idNum.length; index++) {
      let response = await request.delete(`${URL}todos/${idNum[index]['id']}`, {
        headers: {
          "x-challenger": token
        }
      });
      let headers = response.headers();

      expect(response.status()).toBe(200);
      expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));

    }
  });


  test("Выполнить запрос POST для всех записей /todos @POST", async ({ request }) => {

    for (let index = 0; index < 20; index++) {
      let response = await request.post(`${URL}todos`, {
        headers: {
          "x-challenger": token
        },
        data: {
          title: faker.person.bio(),
          doneStatus: true,
          description: faker.person.bio()
        }
      });
      let headers = response.headers();

      expect(response.status()).toBe(201);
      expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
    };

    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token
      },
      data: {
        title: faker.person.bio(),
        doneStatus: true,
        description: faker.person.bio()
      }
    });
    let headers = response.headers();

    expect(response.status()).toBe(400);
      expect(headers).toEqual(expect.objectContaining({'x-challenger': token}));
  });
  
}); 