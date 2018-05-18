import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

areas.forEach((area) => {
  const matchCity = cities.filter(city => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.code,
    });
  }
});

cities.forEach((city) => {
  const matchProvince = provinces.filter(province => province.code === city.provinceCode)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children,
    });
  }
});

const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));

// 根据区号返回省市区的中文（数组）
export function getAreaBycode(code) {
  console.log('区号', code);
  const areaData = areas.filter((area) => {
    return area.code === code;
  });
  const cityData = cities.filter((city) => {
    return city.code === areaData[0].cityCode;
  });
  const provinceData = provinces.filter((province) => {
    return province.code === areaData[0].provinceCode;
  }); 
  return [provinceData[0].name, cityData[0].name, areaData[0].name];
}

export default options;
