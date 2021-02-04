export const groupBy = <T>(data: T[], property: string): Map<any, T[]> => {
  const mapGroup = new Map<any, T[]>();
  data.forEach((item) => {
    const collection = mapGroup.get(item[property]);
    if (!collection) {
      mapGroup.set(item[property], [item]);
    } else {
      collection.push(item);
    }
  });
  return mapGroup;
};
