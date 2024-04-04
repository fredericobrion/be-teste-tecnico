import { ServiceResponse } from '../types/service_response.js'
import City from '../models/city.js'
import { CityToCreate } from '../dto/city_dto.js'

export default class CityService {
  async createCity(data: CityToCreate): Promise<ServiceResponse<City>> {
    const cityToCreate = new City()
    cityToCreate.name = data.name.toLocaleLowerCase()
    cityToCreate.uf = data.uf.toLocaleLowerCase()

    const createdCity = await cityToCreate.save()

    return { status: 'CREATED', data: createdCity }
  }
}
