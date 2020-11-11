export function createUniqueId(db): string {
    let id = '_' + Math.random().toString(36).substr(2, 9);

    let isInUse = this.getById(db) != null ? true : false;
    while (isInUse) {
        id = '_' + Math.random().toString(36).substr(2, 9);
        isInUse = this.getById(db) != null ? true : false;
    }

    return id;
}

export function getById(id: string, db) {
    return db.find(data => data.id == id);
}