# Giới Thiệu về TypeORM

## Giới thiệu

[TypeORM](https://typeorm.io/) là một ORM (Object-Relational Mapper) cho TypeScript và JavaScript (ES7, ES6, ES5). Nó cho phép bạn quản lý cơ sở dữ liệu của mình bằng cách sử dụng các lớp và decorators, làm cho việc làm việc với cơ sở dữ liệu dễ dàng hơn và mạnh mẽ hơn.

## Các tính năng chính

- **Hỗ trợ TypeScript**: TypeORM được viết bằng TypeScript và cung cấp hỗ trợ TypeScript đầy đủ.
- **Các loại cơ sở dữ liệu khác nhau**: TypeORM hỗ trợ nhiều cơ sở dữ liệu như MySQL, MariaDB, PostgreSQL, SQLite, và Microsoft SQL Server.
- **Migration**: TypeORM cung cấp các công cụ để thực hiện migration giúp quản lý sự thay đổi của cơ sở dữ liệu.
- **Quan hệ**: TypeORM hỗ trợ các loại quan hệ giữa các bảng như `One-to-One`, `One-to-Many`, và `Many-to-Many`.
- **Repository và Query Builder**: Cung cấp các công cụ mạnh mẽ để truy vấn dữ liệu và làm việc với các repository.

## Cài đặt

Để cài đặt TypeORM, bạn có thể sử dụng npm hoặc yarn:

```sh
npm install typeorm reflect-metadata
npm install mysql2  # Cài đặt driver cho cơ sở dữ liệu MySQL
```

## Định nghĩa các Entity và Quan hệ

**Author.ts**
```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  familyName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'date', nullable: true })
  dateOfDeath: Date;

  @Column({ nullable: true })
  url: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}

```

* `@Entity()`: Đánh dấu lớp này là một entity (thực thể) trong TypeORM.
* `@PrimaryGeneratedColumn()`: Đánh dấu cột id là khóa chính và giá trị của nó sẽ được tự động tạo.
* `@Column()`: Đánh dấu một thuộc tính là một cột trong bảng cơ sở dữ liệu.
* `@OneToMany()`: Thiết lập quan hệ một-nhiều với entity Book.

**Book.ts**
```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { Author } from "./Author";
import { BookInstance } from "./BookInstance";
import { Genre } from "./Genre";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column()
  isbn: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Author, (author) => author.books, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @OneToMany(() => BookInstance, (instance) => instance.book)
  bookInstances: BookInstance[];

  @ManyToMany(() => Genre, (genre) => genre.books)
  @JoinTable()
  genres: Genre[];
}

```

* `@ManyToOne()`: Thiết lập quan hệ nhiều-một với entity Author. onDelete: 'CASCADE' nghĩa là khi một tác giả bị xóa, tất cả các sách liên quan cũng sẽ bị xóa. @JoinColumn() xác định rõ cột khóa ngoại.
* `@OneToMany()`: Thiết lập quan hệ một-nhiều với entity BookInstance.
* `@ManyToMany()`: Thiết lập quan hệ nhiều-nhiều với entity Genre. @JoinTable() tạo ra bảng trung gian để lưu trữ các quan hệ này.


**BookInstance.ts**

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class BookInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imprint: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Book, (book) => book.bookInstances, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;
}

```
* `@ManyToOne()`: Thiết lập quan hệ nhiều-một với entity Book. onDelete: 'CASCADE' nghĩa là khi một sách bị xóa, tất cả các bản sao liên quan cũng sẽ bị xóa. @JoinColumn() xác định rõ cột khóa ngoại.

**Genre.ts**

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  url: string;

  @ManyToMany(() => Book, (book) => book.genres)
  books: Book[];
}

```


* `@ManyToMany()`: Thiết lập quan hệ nhiều-nhiều với entity Book.

## Migration
Migration là một công cụ mạnh mẽ giúp bạn quản lý các thay đổi trong cơ sở dữ liệu của mình một cách có tổ chức và nhất quán. Dưới đây là các bước cơ bản để tạo và chạy migration trong TypeORM.

### Tạo Migration
Để tạo một migration mới, bạn có thể sử dụng lệnh sau:
```bash
npx typeorm migration:generate -d <đường_dẫn_đến_dataSource> <đường_dẫn_đến_thư_mục_lưu_migration>

```
Lệnh này sẽ tạo ra một file migration mới với tên `MigrationName` trong thư mục `src/migration.`

### Chạy Migration
Để chạy tất cả các migration chưa được chạy, bạn sử dụng lệnh:
```bash
npx typeorm migration:run

```

### Hoàn tác Migration
Để hoàn tác migration đã chạy, bạn có thể sử dụng lệnh sau:

```sh
npx typeorm migration:revert
```


### Ví dụ về Migration
Dưới đây là một ví dụ về nội dung của một file migration:

```ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooks1627299269190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE author (
        id INT AUTO_INCREMENT NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        familyName VARCHAR(255) NOT NULL,
        dateOfBirth DATE,
        dateOfDeath DATE,
        url VARCHAR(255),
        PRIMARY KEY(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE book (
        id INT AUTO_INCREMENT NOT NULL,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        isbn VARCHAR(13) NOT NULL,
        url VARCHAR(255),
        authorId INT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT FK_author FOREIGN KEY (authorId) REFERENCES author(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE genre (
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255),
        PRIMARY KEY(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE book_instance (
        id INT AUTO_INCREMENT NOT NULL,
        imprint VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        dueDate DATE,
        url VARCHAR(255),
        bookId INT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT FK_book FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE book_genres_genre (
        bookId INT NOT NULL,
        genreId INT NOT NULL,
        PRIMARY KEY(bookId, genreId),
        CONSTRAINT FK_book_genre_book FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE,
        CONSTRAINT FK_book_genre_genre FOREIGN KEY (genreId) REFERENCES genre(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE book_genres_genre`);
    await queryRunner.query(`DROP TABLE book_instance`);
    await queryRunner.query(`DROP TABLE book`);
    await queryRunner.query(`DROP TABLE genre`);
    await queryRunner.query(`DROP TABLE author`);
  }
}

```


### Sử dụng các Entity
Dưới đây là cách sử dụng các entity đã định nghĩa để lưu dữ liệu vào cơ sở dữ liệu:
```ts
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Author } from "./entity/Author";
import { Book } from "./entity/Book";
import { BookInstance } from "./entity/BookInstance";
import { Genre } from "./entity/Genre";

createConnection().then(async connection => {
  console.log("Inserting a new author into the database...");
  const author = new Author();
  author.firstName = "J.K.";
  author.familyName = "Rowling";
  author.dateOfBirth = new Date('1965-07-31');
  await connection.manager.save(author);
  console.log("Saved a new author with id: " + author.id);

  console.log("Inserting a new genre into the database...");
  const genre = new Genre();
  genre.name = "Fantasy";
  genre.url = "http://example.com/fantasy";
  await connection.manager.save(genre);
  console.log("Saved a new genre with id: " + genre.id);

  console.log("Inserting a new book into the database...");
  const book = new Book();
  book.title = "Harry Potter and the Philosopher's Stone";
  book.summary = "A young wizard's journey begins.";
  book.isbn = "9780747532699";
  book.url = "http://example.com/harrypotter1";
  book.author = author;
  book.genres = [genre];
  await connection.manager.save(book);
  console.log("Saved a new book with id: " + book.id);

}).catch(error => console.log(error));

```

## Seed data với faker 
Để seed dữ liệu vào cơ sở dữ liệu với nhiều đối tượng và đảm bảo các quan hệ giữa chúng được thiết lập chính xác, bạn có thể sử dụng một file script TypeScript riêng biệt. Dưới đây là một ví dụ về cách seed dữ liệu với `faker` và `TypeORM`:
**seedData.ts**

```ts
import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'

import { faker } from '@faker-js/faker'
import { Author } from '@/entity/author.entity'
import { Genre } from '@/entity/genre.entity'
import { Book } from '@/entity/book.entity'
import { BookInstance } from '@/entity/book-instance.entity'

async function seed() {
  try {
    const connection: Connection = await createConnection()
    console.log('Connected to the database.')

    const authors = await seedAuthors(connection)
    const genres = await seedGenres(connection)
    const books = await seedBooks(connection, authors, genres)
    await seedBookInstances(connection, books)

    await connection.close()
    console.log('Seed data successfully inserted!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

async function seedAuthors(connection: Connection): Promise<Author[]> {
  const authorRepository = connection.getRepository(Author)
  const authors: Author[] = []

  for (let i = 0; i < 5; i++) {
    const author = new Author()
    author.firstName = faker.person.firstName()
    author.familyName = faker.person.lastName()
    author.dateOfBirth = faker.date.past()
    author.dateOfDeath = faker.date.future()
    author.url = faker.image.avatarLegacy()
    await authorRepository.save(author)
    authors.push(author)
  }

  console.log(`Seeded ${authors.length} authors.`)
  return authors
}

async function seedGenres(connection: Connection): Promise<Genre[]> {
  const genreRepository = connection.getRepository(Genre)
  const genres: Genre[] = []

  for (let i = 0; i < 3; i++) {
    const genre = new Genre()
    genre.name = faker.word.adverb()
    genre.url = faker.internet.url()
    await genreRepository.save(genre)
    genres.push(genre)
  }

  console.log(`Seeded ${genres.length} genres.`)
  return genres
}

async function seedBooks(connection: Connection, authors: Author[], genres: Genre[]): Promise<Book[]> {
  const bookRepository = connection.getRepository(Book)
  const books: Book[] = []

  for (let i = 0; i < 10; i++) {
    const book = new Book()
    book.title = faker.lorem.words(5)
    book.summary = faker.lorem.paragraph()
    book.isbn = faker.string.alpha(5)
    book.url = faker.image.urlLoremFlickr()
    book.author = faker.helpers.arrayElement(authors)

    // Kiểm tra và thêm thể loại
    const uniqueGenres = new Set<Genre>()
    while (uniqueGenres.size < 2) {
      uniqueGenres.add(faker.helpers.arrayElement(genres))
    }
    book.genres = Array.from(uniqueGenres)

    try {
      await bookRepository.save(book)
      books.push(book)
      console.log(`Seeded book ${book.title}.`)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.warn(`Skipping duplicate entry for book ${book.title}.`)
      } else {
        console.error(`Error saving book ${book.title}:`, error)
      }
    }
  }

  console.log(`Seeded ${books.length} books.`)
  return books
}

async function seedBookInstances(connection: Connection, books: Book[]): Promise<void> {
  const bookInstanceRepository = connection.getRepository(BookInstance)

  for (let i = 0; i < 20; i++) {
    const bookInstance = new BookInstance()
    bookInstance.imprint = faker.company.buzzVerb()
    bookInstance.status = faker.helpers.arrayElement(['Available', 'Borrowed', 'Reserved'])
    bookInstance.dueDate = faker.date.future()
    bookInstance.url = faker.internet.url()
    bookInstance.book = faker.helpers.arrayElement(books)
    await bookInstanceRepository.save(bookInstance)
  }

  console.log('Seeded book instances.')
}

seed()

```

**Trong ví dụ này:**

- Chúng ta sử dụng `faker-js/faker` để tạo dữ liệu ngẫu nhiên cho các đối tượng `Author`, `Genre`, `Book`, và `BookInstance`.
`createConnection()` được sử dụng để thiết lập kết nối đến cơ sở dữ liệu.
- Mỗi hàm seed (seedAuthors, seedGenres, seedBooks, seedBookInstances) tạo và lưu các đối tượng vào cơ sở dữ liệu, đảm bảo các quan hệ giữa các entity được thiết lập chính xác.
- Hàm `seed()` là hàm chính để gọi các hàm seed và quản lý quá trình seed dữ liệu.


**Để chạy file này, bạn cần cài đặt typeorm, reflect-metadata và faker:**

```bash 
npm install typeorm reflect-metadata faker-js/faker
```

**Sau đó, bạn có thể chạy file seed bằng lệnh sau:**

```bash 
npx ts-node seedData.ts

```
