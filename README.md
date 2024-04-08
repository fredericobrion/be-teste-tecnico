# Teste técnico Be - Back-End

## Descrição:
Uma API RESTful que permite a um usuário logado realizar cadastros de clientes, produtos e vendas. Após o login, o usuário recebe um token de autenticação. Esse token deve ser incluído no cabeçalho da requisição, utilizando o campo Authorization e o formato 'Bearer TOKEN', para executar operações relacionadas a clientes, produtos e vendas.

## Dificuldades no desenvolvimento:
Inicialmente, a aplicação foi concebida para que tanto o banco de dados quanto o servidor funcionassem em containers, mas encontrei dificuldades ao tentar estabelecer a conexão com o banco de dados dessa maneira.

## Iniciando a aplicação:
1. Clone o repositório e entre no diretório da aplicação:
   ```
   git clone git@github.com:fredericobrion/be-teste-tecnico.git && cd be-teste-tecnico
   ```
2. Entre no diretório da aplicação e crie o arquivo ```.env``` contendo as variáveis de ambiente.
   ```
   cd api && touch .env
   ```
   Preencha o arquivo ```.env``` de acordo com o modelo do arquivo ```.env.example```
3. Instale as dependências:
   ```
   npm install
   ```
4. Caso não possua um servidor MYSQL rodando em sua máquina, inicie um utilizando o Docker:
   ```
   cd .. && docker-compose up -d --build
   ```
5. No diretório ```api``` inicie a aplicação:
   ```
   npm start
   ```

## Testes
A aplicação possui testes unitários para as camadas de Service. Para executar os testes, esteja no diretório ```api``` e rode o comando ```npm run test```

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
   - ```GET /clients``` para listar os clientes cadastrados.
   - ```GET /clients/:id``` para detalhar um cliente e vendas associadas a ele.
   - ```GET /clients/:id/filter?month=MM&year=YYYY``` para detalhar um cliente e filtrar as vendas por mês e ano.
     - Substitua ```MM``` por um valor entre ```1``` e ```12``` para selecionar o mês da venda.
     - Substitua ```YYYY``` por um valor maior do que ```1900``` para selecionar o ano da venda.
     - Caso queira filtrar apenas pelo mês, utilize o endpoint ```GET /clients/:id/filter?month=MM```
     - Caso queira filtrar apenas pelo ano, utilize o endpoint ```GET /clients/:id/filter?year=YYYY```
   - ```POST /clients``` para adicionar um cliente.
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
   - ```PUT /clients/:id``` para editar um cliente.
     - O corpo da requisição deverá conter os dados que serão atualizados. Os campos disponíveis para atualização são os mesmo utilizados para criar um cliente.
     - Exemplo: Caso queira atualizar o ```email```, a ```rua```, o ```bairro``` e o ```cep```, o corpo da requisição deverá ser:
      ```
      {
      "email": "maria@gmail.com",
      "street": "Rua B",
      "neighborhood": "São Mateus",
      "cep": "25894-589"
      }
      ```
   - ```DELETE /clients/:id``` para excluir um cliente e as vendas associadas a ele.
  
4. Endpoint ```/products``` para os produtos.
   - ```GET /products``` para listar os produtos cadastrados.
   - ```GET /products/:id``` para detalhar um produto.
   - ```POST /products``` para adicionar um produto.
     - O corpo da requisição deverá ser no seguinte formato:
       ```
       {
       "name": "O senhor dos anéis: A sociedade do anel",
       "description": "O primeiro volume da aclamada triologia de J. R. R. Tolkien",
       "price": 39.99
       }
       ```
   - ```PUT /products/:id``` para editar um produto.
     - O corpo da requisição deverá conter os dados que serão atualizados. Os campos disponíveis para atualização são os mesmo utilizados para criar um produto.
     - Exemplo: Caso queira atualizar a ```descrição``` e ```preço```, o corpo da requisição deverá ser:
     ```
     {
     "description": "O primeiro volume da aclamada triologia de John Ronald Reuel Tolkien",
     "price": 29.99
     }
     ```
   - ```DELETE /products/:id``` para excluir um produto.
     
5. Cadastro de uma venda através do endpoint ```POST /sales/:clientId```.
   - O corpo da requisição deverá ser no seguinte formato:
   ```
   {
   "productId": 1,
   "quantity": 8,
   "createdAt": "01/03/2024 12:00:00"
   }
   ```
   O campo ```createdAt``` é opcional. Se não for especificado, a venda será registrada na data e horário da requisição.
       
