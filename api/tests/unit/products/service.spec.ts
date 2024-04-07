import { test } from '@japa/runner'
import ProductService from '../../../app/services/products_service.js'
import { ProductFactory } from '../../../database/factories/product_factory.js'
import Product from '../../../app/models/product.js'
import Sinon from 'sinon'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

test.group('Products service', () => {
  test('product already exists', async ({ assert }) => {
    const mockedProduct = await ProductFactory.makeStubbed()

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => mockedProduct,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.createProduct({
      name: mockedProduct.name,
      description: mockedProduct.description,
      price: mockedProduct.price,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'Product already registered' })
  }).cleanup(() => Sinon.restore())

  test('create product', async ({ assert }) => {
    const mockedProduct = await ProductFactory.makeStubbed()

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => null,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)
    Sinon.stub(Product, 'create').resolves(mockedProduct)

    const response = await productService.createProduct({
      name: mockedProduct.name,
      description: mockedProduct.description,
      price: mockedProduct.price,
    })

    assert.equal(response.status, 'CREATED')
    assert.deepEqual(response.data, mockedProduct)
  }).cleanup(() => Sinon.restore())

  test('product not found', async ({ assert }) => {
    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => null,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.getProductById(1)

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Product not found' })
  }).cleanup(() => Sinon.restore())

  test('get product by id', async ({ assert }) => {
    const mockedProduct = await ProductFactory.makeStubbed()

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => mockedProduct,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.getProductById(mockedProduct.id)

    const expectedProduct = {
      id: mockedProduct.id,
      name: mockedProduct.name,
      description: mockedProduct.description,
      price: mockedProduct.price,
    }

    assert.equal(response.status, 'OK')
    assert.deepEqual(response.data, expectedProduct)
  }).cleanup(() => Sinon.restore())

  test('product not found', async ({ assert }) => {
    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => null,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.updateProduct(1, {
      name: 'new name',
      description: 'new description',
      price: 100,
    })

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Product not found' })
  }).cleanup(() => Sinon.restore())

  test('update product', async ({ assert }) => {
    const mockedProduct = await ProductFactory.makeStubbed()

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => mockedProduct,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)
    Sinon.stub(mockedProduct, 'save').resolves(mockedProduct)

    const response = await productService.updateProduct(mockedProduct.id, {
      name: 'new name',
      description: 'new description',
      price: 100,
    })

    const expectedProduct = {
      id: mockedProduct.id,
      name: 'new name',
      description: 'new description',
      price: 100,
    }

    assert.equal(response.status, 'OK')
    assert.deepEqual(response.data, expectedProduct)
  }).cleanup(() => Sinon.restore())

  test('get all products', async ({ assert }) => {
    const mockedProducts = await ProductFactory.makeStubbedMany(3)

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => mockedProducts,
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.getAllProducts()

    const expectedProducts = mockedProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
      }
    })

    assert.equal(response.status, 'OK')
    assert.deepEqual(response.data, expectedProducts)
  }).cleanup(() => Sinon.restore())

  test('product not found', async ({ assert }) => {
    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => null,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const response = await productService.deleteProduct(1)

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Product not found' })
  }).cleanup(() => Sinon.restore())

  test('delete product', async ({ assert }) => {
    const mockedProduct = await ProductFactory.makeStubbed()

    const productService = new ProductService()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: async () => mockedProduct,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)
    Sinon.stub(mockedProduct, 'save').resolves(mockedProduct)

    const response = await productService.deleteProduct(mockedProduct.id)

    assert.equal(response.status, 'NO_CONTENT')
    assert.isNull(response.data)
  }).cleanup(() => Sinon.restore())
})
