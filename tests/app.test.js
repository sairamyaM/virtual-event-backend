const request = require("supertest");
const app = require("./app");
const User = require("../models/User");
const Event = require("../models/Event");

require("./setup"); 

let organizerToken, attendeeToken, eventId;

describe("Authentication", () => {

  test("Register organizer", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Organizer",
        email: "org@example.com",
        password: "123456",
        role: "organizer"
      });

    expect(res.status).toBe(201);
  });

  test("Register attendee", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "User",
        email: "user@example.com",
        password: "123456",
        role: "attendee"
      });

    expect(res.status).toBe(201);
  });

  test("Organizer login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "org@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    organizerToken = res.body.token;
  });

  test("Attendee login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    attendeeToken = res.body.token;
  });

});

describe("Event CRUD", () => {

  test("Organizer can create event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${organizerToken}`)
      .send({
        title: "My Event",
        description: "Testing Mongo",
        date: "2025-01-01",
        time: "10:00 AM"
      });

    expect(res.status).toBe(201);
    eventId = res.body.event._id;
  });

  test("Attendee cannot create event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${attendeeToken}`)
      .send({
        title: "Hack Attempt",
        date: "2025-01-01",
        time: "10:00 AM"
      });

    expect(res.status).toBe(403);
  });

  test("Organizer can update event", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${organizerToken}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    expect(res.body.event.title).toBe("Updated Title");
  });

  test("Attendee cannot modify event", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${attendeeToken}`)
      .send({ title: "Should Fail" });

    expect(res.status).toBe(403);
  });

});

describe("Event Registration", () => {

  test("Attendee can register for event", async () => {
    const res = await request(app)
      .post(`/events/${eventId}/register`)
      .set("Authorization", `Bearer ${attendeeToken}`);

    expect(res.status).toBe(200);
    expect(res.body.event.participants.length).toBe(1);
  });

  test("Attendee cannot register twice", async () => {
    const res = await request(app)
      .post(`/events/${eventId}/register`)
      .set("Authorization", `Bearer ${attendeeToken}`);

    expect(res.status).toBe(400);
  });

});

describe("Event Delete", () => {

  test("Attendee cannot delete event", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${attendeeToken}`);

    expect(res.status).toBe(403);
  });

  test("Organizer can delete event", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${organizerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event deleted");
  });

});
