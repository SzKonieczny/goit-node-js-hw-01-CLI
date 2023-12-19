const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "./db/contacts.json");
const { v4 } = require("uuid");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactById = contacts.find(({ id }) => id === contactId);

  if (!contactById) {
    return "error - contact not found";
  }

  return contactById;
}

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: v4(), name: name, email: email, phone: phone };

  contacts.push(newContact);
  await updateContacts(contacts);

  return newContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);

  if (idx === -1) {
    return "error - contact not found";
  }

  const [removedContact] = contacts.splice(idx, 1);
  await updateContacts(contacts);

  return removedContact;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
