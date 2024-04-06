# Teste técnico Be - Back-End

## Descrição:
Uma API RESTful que permite a um usuário logado realizar cadastros de clientes, produtos e vendas. Após o login, o usuário recebe um token de autenticação. Esse token deve ser incluído no cabeçalho da requisição, utilizando o campo Authorization e o formato 'Bearer TOKEN', para executar operações relacionadas a clientes, produtos e vendas.

## Iniciando a aplicação:

## Funcionalidades
1. Cadastro de um usuário através do endpoint ```POST /register```.
  - O corpo da requisição deverá ser no seguinte formato:
    ```
    {
    "name": "joao",
    "email": "joao@email.com",
    "password": "123456"
    }
    ```
    
2. Login de um usuário cadastrado através do endpoint ```POST /login```.
   - O corpo da requisição deverá ser no seguinte formato:
   ```
   {
   "email": "joao@email.com",
   "password": "123456"
   }
   ```

3. Endpoint ```/clients``` para os clientes.
   - ```GET /clients``` para listar os usuários.
   - ```GET /clients/:id``` para detalhar um cliente e vendas associadas a ele.
   - ```GET /clients/:id/filter?month=MM&year=YYYY``` para detalhar um cliente e filtrar as vendas por mês e ano.
     - Substitua ```MM``` por um valor entre ```1``` e ```12``` para selecionar o mês da venda.
     - Substitua ```YYYY``` por um valor maior do que ```1900``` para selecionar o ano da venda.
     - Caso queira filtrar apenas pelo mês, utilize o endpoint ```GET /clients/:id/filter?month=MM```
     - Caso queira filtrar apenas pelo ano, utilize o endpoint ```GET /clients/:id/filter?year=YYYY```
   - ```POST /clients``` para adicionar um usuário.
     - O corpo da requisição deverá ser no seguinte formato:
      ```
      {
      "name": "Maria",
      "email": "maria@email.com",
      "cpf": "088.479.124-11",
      "cep": "36016-890",
      "street": "Rua A",
      "number": "16",
      "complement": "Apartamento 101",
      "neighborhood": "Centro",
      "city": "Juiz de Fora",
      "uf": "MG",
      "phone": "(32) 99185-5841"
      }
      ```
      O campo ```complement``` é opcional.
