let ObjectID

export function setObjectID (obj) {
  ObjectID = obj
}

export default function (id) {
  return new ObjectID(id)
}
