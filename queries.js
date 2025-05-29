// queries.js - script to perform various MongoDB queries, aggregation, and indexing operations

//Import the MongoDB driver
const{MongoClient} = require('mongodb');

// connection URI for your MongoDB instance
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function  main(){
    const client = new MongoClient(uri);
    try {
        // connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB server for queries');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        console.log(`Database '${dbName}' and Collection '${collectionName}' initialized`);

        //TASK 2 BASIC OPERATIONS
        console.log('\n ----Basic Operations on Books Collection----');

        // Query 1: Find all books by a specific author
        console.log ('\n----Query 1: Find all books in a specific genre----');
        // Find all books in a specific genre

        console.log('Books in the genre "Fiction":');
        const FictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
        console.log(FictionBooks.map(book => book.title));

        // Query 2: Find books published after a specific year
        console.log('\n----Query 2: Find books published after a specific year----');
        // Find books published after 1950
        console.log('Books published after 1950:');
        const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
        console.log(recentBooks.map(book => `${book.title} (${book.published_year})`));


        // Query 3: Find books by specific author
        console.log('\n----Query 3: Find books by a specific author----');
        // Find books by George Orwell
        console.log('Books by George Orwell:');
        const orwellBooks = await collection.find({author: 'George Orwell' }).toArray();
        console.log(orwellBooks.map(book => `${book.title} (${book.published_year})`));

        // Query 4: update the price of a specific book
        console.log('\n----Query 4: Update the price of a specific book(The Great Gatsby)----');
        // Update the price of "The Great Gatsby"
        const updateResult = await collection.updateOne(
            { title: 'The Great Gatsby' },
            { $set: { price: 12.99 } }
        );
        console.log(`${updateResult.modifiedCount} book(s) updated.`);
        const updatedBook = await collection.findOne({ title: 'The Great Gatsby' });
        console.log(`Updated book: ${updatedBook.title} - New Price: $${updatedBook.price}`);

        // Query 5: Delete a book by title
        console.log('\n----Query 5: Delete a book by title (Wuthering Heights)----');
        // Delete "Wuthering Heights"
        const deleteResult = await collection.deleteOne({ title: 'Wuthering Heights' });
        console.log(`${deleteResult.deletedCount} book(s) deleted.`);
        const foundWuthering = await collection.findOne({ title: 'Wuthering Heights' });
        console.log(`Found Wuthering Heights:`, foundWuthering); // should be null if deleted

        // TASK 3  ADVANCES QUERIES
        console.log('\n ----Advanced Queries on Books Collection----');

        //Finding books that are both in stock and published after 2010 with projection
        console.log(`\nFinding books in stock and published after 2010 with projection: title, author, and price`);
        const inStockRecentBooks = await collection.find(
            { in_stock: true, published_year: { $gt: 2010 } },
            { projection: { title: 1, author: 1, price: 1 } }
        ).toArray();
        console.log(inStockRecentBooks);


        //Implement sorting to display books by price in ascending order
        console.log(`\nBooks sorted by price in ascending order:`);
        const booksSortedAsc = await collection.find({})
            .project({ title: 1, price: 1 , _id: 0 })
            .sort({ price: 1 })
            .toArray();
        console.log(booksSortedAsc);

        //Implement sorting to display books by price in descending order
        console.log(`\nBooks sorted by price in descending order:`);
        const booksSortedDesc = await collection.find({})
            .project({ title: 1, price: 1 , _id: 0 })
            .sort({ price: -1 })
            .toArray();
        console.log(booksSortedDesc);

        //use the limit and skip methods to implement pagination (5 books per page)
        console.log(`\nPaginated books (5 per page):`);
        const pageSize = 5;
        const totalBooks = await collection.countDocuments();
        const totalPages = Math.ceil(totalBooks / pageSize);

        for (let page = 0; page < totalPages; page++) {
            const paginatedBooks = await collection.find({})
                .project({ title: 1, author: 1, _id: 0 })
                .sort({ title: 1 }) // Sort by title for consistent pagination
                .skip(page * pageSize)
                .limit(pageSize)
                .toArray();
            console.log(paginatedBooks);
        }

        // TASK 4 AGGREGATION
        console.log('\n ----Aggregation Operations on Books Collection----');

        // Calculate the average price of all books by genre
        console.log(`\nCalculating the average price of books by genre:`);
        const avgPriceByGenre = await collection.aggregate([
            { $group: { _id: '$genre', averagePrice: { $avg: '$price' } } },
            { $sort: { averagePrice: 1 } } // Sort by average price ascending
        ]).toArray();
        console.log(avgPriceByGenre);

        // find the author with the most books in the collection
        console.log(`\nFinding the author with the most books`);
        const mostBooksAuthor = await collection.aggregate([
            { $group: { _id: '$author', bookCount: { $sum: 1 } } },
            { $sort: { bookCount: -1 } }, // Sort by book count descending
            { $limit: 1 } // Get the top author
        ]).toArray();
        console.log(mostBooksAuthor);

        console.log('\nBooks grouped by publication decade:');
        const booksByDecade = await collection.aggregate([
            {

                $project: {
                    _id: 0,
                    title:1,
                    piblished_year: 1,
                    decade: { $subtract: ['$published_year', { $mod: ['$published_year', 10] }] } // Calculate the start of the dacate
                }
            },

            {
                $group:{
                    _id:'$dacade',
                    count: { $sum: 1 },
                    titles: { $push: '$title' } // Optional: Collect titles in each decade
                }
            },

            { $sort: { _id: 1 } } // Sort by decade ascending
            ]).toArray();
        console.log(booksByDecade);

        // TASK 5 INDEXING
        console.log('\n---Task 5: Indexing ---');
        
        //Create an index on the title field for faster searches
        console.log(`\nCreating an index on the "title" field....`);
        await collection.createIndex({ title: 1 });
        console.log(`Indec on "title" created`);

        // Create a compound index an author and published_year
        console.log(`\nCreating compound index on "author" and "published_year" fields....`);
        await collection.createIndex({ author: 1, published_year: -1 });
        console.log(`Compound index on "author" and "published_year" created`);

        //Use the explain() method to demomstate the performance improvement with your indexes
        console.log(`\nExplaining query performance with indexes...`);

        // Query using the single index on 'title'
        console.log(`\nExplain for finding "The Hobbit" (using title index):`);
        // The expalin() methof retuens details about the query plan.
        // 'executionStats' provides information about the execution.
        const explainTitleQuery = await collection.find({ title: 'The Hobbit' }).explain('executionStats');
        console.log('Query Plan stages:', explainTitleQuery.queryPlanner.winningPlan.stage);
        console.log('Docs Examined:', explainTitleQuery.executionStats.totalDocsExamined);
        console.log('Keys Examined:', explainTitleQuery.executionStats.totalKeysExamined);

        // Query using the compound index and 'author' and 'published_year'
        console.log(`\nExplain for finding books by"J.R.R. Tolkien" published after 1950 (using compound index):`);
        const explainCompoundQuery = await collection.find({ 
            author: 'J.R.R. Tolkien', 
            published_year: { $gt: 1950 } })
            .sort({ published_year: -1 }) // Sort by published_year descending
            .explain('executionStats');
        // Use inputStage if present, otherwise fallback to stage
        const winningPlan = explainCompoundQuery.queryPlanner.winningPlan;
        const stage = winningPlan.inputStage ? winningPlan.inputStage.stage : winningPlan.stage;
        console.log('Query Plan stage:', stage);
        console.log('Docs Examined:', explainCompoundQuery.executionStats.totalDocsExamined);
        console.log('Keys Examined:', explainCompoundQuery.executionStats.totalKeysExamined);

    


    }

    catch (err) {
        console.error('Error occurred:', err);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

main().catch(console.error);