import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { SecretToken } from "../src/helperForApi/helper.js";

test.describe("API challenge", () => {
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
  
}); 
