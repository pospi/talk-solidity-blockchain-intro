layout: true
name: base

<!-- Remark base template -->

<header>
    <h6>Solidity &amp; Systems Programming on the Blockchain</h6>
</header>

{{ content }}

<footer>
    <ul>
        <li><strong>pospi</strong></li>
        <li>pospi@spadgos.com</li>
        <li>https://twitter.com/pospigos</li>
        <li>http://pospi.spadgos.com</li>
        <li>https://github.com/pospi</li>
    </ul>
</footer>

---

# Agenda

<!-- MarkdownTOC -->

- [Same concepts, different environment](#same-concepts-different-environment)
- [Solidity is not the end-all](#solidity-is-not-the-end-all)
- [Words of caution](#words-of-caution)
- [Best places to get started](#best-places-to-get-started)
- [Micro-optimisations are important](#micro-optimisations-are-important)
- [Types](#types)
    - [Value types](#value-types)
    - [Reference types](#reference-types)
        - [Data location](#data-location)
        - [Byte arrays](#byte-arrays)
        - [Reference arrays](#reference-arrays)
            - [Caveats](#caveats)
        - [Complex types](#complex-types)
    - [Addresses](#addresses)
        - [attributes](#attributes)
        - [methods](#methods)
- [Control flow & syntax](#control-flow--syntax)
- [Function modifiers](#function-modifiers)
- [Contract structure](#contract-structure)
- [Constants](#constants)
- [Method visibility](#method-visibility)
- [Contracts calling contracts](#contracts-calling-contracts)
- [Library code](#library-code)
- [What are contract events for?](#what-are-contract-events-for)
    - [Event interface](#event-interface)
- [Code best-practises](#code-best-practises)
        - [Iteration vs recursion](#iteration-vs-recursion)
        - [Mapping vs. Array](#mapping-vs-array)
        - [Composition or inheritance](#composition-or-inheritance)
        - [Delegates](#delegates)
        - [Misc gotchas](#misc-gotchas)
- [Inline assembly](#inline-assembly)
- [TheDAO hack: what went wrong?](#thedao-hack-what-went-wrong)
    - [Short version](#short-version)
    - [Guidelines to avoid this pitfall](#guidelines-to-avoid-this-pitfall)
- [Solar storm?!](#solar-storm)
- [Towards a better language?](#towards-a-better-language)
- [Unit tests are important](#unit-tests-are-important)
- [On-chain is not always the answer](#on-chain-is-not-always-the-answer)
- [Contract design patterns](#contract-design-patterns)
- [Contract base classes](#contract-base-classes)
- [Function libraries](#function-libraries)
- [Some real stats: quicksort vs. heapsort](#some-real-stats-quicksort-vs-heapsort)
- [Build toolchain](#build-toolchain)
    - [Observations:](#observations)

<!-- /MarkdownTOC -->




<!-- ---------------------------------------------------------------------------
PART 1: PERFORMANCE
--------------------------------------------------------------------------- -->



---
# Same concepts, different environment

Solidity should be thought of as a *systems programming language*. Though syntactically similar to JavaScript, it is much more like C++ in terms of its structure and ways of handling data & memory.

- Ethereum blockchain ~= RAM ~= Hard Drive
- Ethereum Virtual Machine (EVM) ~= Java Virtual Machine (JVM) ~= x86 CPU
- Contract bytecode ~= Java Bytecode ~= x86 bytecode
- Solidity ~= C++ ~= Java
- Solidity compilers (`solc`) ~= `gcc` ~= `gcc-c++` ~= `javac`
- Contracts ~= Classes
- Deployed contracts ~= Objects
- Deployed contract address ~= memory address ~= file inode

RAM & hard disk are combined since Ethereum's execution *as a program* and its blockchain storage *as state* are fused into the same thing. As we'll soon see, "reading a file" is no longer a task we need be concerned with.

**Ethereum is a low-level system**. Think of it like programming for an Onion Omega or Raspberry Pi. Resources are extremely scarce. There isn't even a floating point unit (yet!).


---
# Solidity is not the end-all

Serpent and LLL can also be written, and likely more efficiently (LLL in particular). Try them all out in-browser!

- https://ethereum.github.io/browser-solidity/ - Solidity scripting
- http://etherscripter.com - visual code editor, Serpent and LLL scripting

All compile to EVM bytecode. Solidity was not the first EVM-compiled language, and it will not be the last.

Solidity is also arguably not very well suited to the task &mdash; see The Great DAO Hack! We'll come back to this later...



---
# Words of caution

> Do not develop Solidity contracts without a reasonable grasp of the underlying Ethereum Virtual Machine execution model, particularly around gas costs.
>
> &mdash; <cite>http://vessenes.com/ethereum-griefing-wallets-send-w-throw-considered-harmful/</cite>


---
# Best places to get started

http://solidity.readthedocs.io/ (most complete reference material I could find)
https://ethereumbuilders.gitbooks.io/guide/ (an oldie but a goodie, also contains some Serpent documentation)
https://docs.erisindustries.com/tutorials/solidity/ <!-- :TODO: QA this -->



---
# Micro-optimisations are important

Pre-increment vs. post-increment, `for` vs `foreach`, references vs. copies: all those arguments we gave up on years ago are back and more important than ever. Why?

<ul style="font-weight: bold;">
    <li>Clock cycles cost ether and make slow code more expensive to run.</li>
    <li>Inefficient storage causes blockchain bloat and makes it less practical for everyone to sync.</li>
    <li>
        Computation costs electricity and creates hundreds of millions of tonnes of CO<sub>2</sub> every year.<br />
        <sub><em>(
            source: 
            <a href="http://www.coindesk.com/microscope-economic-environmental-costs-bitcoin-mining/">
                http://www.coindesk.com/microscope-economic-environmental-costs-bitcoin-mining/
            </a>
        )</em></sub>
    </li>
</ul>

Two metrics: bytecode size and wei cost (estimated and actual).


---
# Types


## Value types

- int8..int256, uint8..uint256
    - without the qualifier will use the `*256`-sized types
- bool 
    - uses 1 byte for storage
- fixed byte arrays: byte/bytes1..bytes32
    - assignment must be done with bitwise operators currently(?)
    - has a `length` attribute
- No floats, but fixed-point math is built in to the syntax
    - see `ufixed8x248`, `ufixed128x128` and similar types- 
    - FPU "coming soon". I wouldn't be surprised if this does not come until Ethereum 2.0 (proof of stake). If a Nintendo DS is too low-powered for one, then the EVM *definitely* is.
- enums (c-like, stored as smallest possible `int` type)
- time units and ether units can all be entered literally for convenience and are interpreted as the base type (`wei` and `second`). `2 ether == 2000 finney`, `1 minutes == 60 seconds` etc. Note that all arithmetic uses ideal time and does not account for timezones, leap seconds or otherwise.



---
## Reference types


### Data location

For reference types, we have to think about whether the data they reference is only kept in `memory` while the EVM is running this execution cycle, or if they should persist to `storage`. If you continue to think of contracts the same as classes, then these semantics should follow:

> The default for function parameters (including return parameters) is memory, the default for local variables is storage and the location is forced to storage for state variables (obviously).

- Contracts ~= Classes
- Deployed contracts ~= Objects
- Contract functions ~= Object methods
- State (`storage`) variables ~= Instance variables

You must declare `storage` in your function signatures if you want to operate on storage data without it being copied into memory first (which is an expensive operation). All memory keeps its existing context except for when storage data is passed in as a non-storage function parameter. <!-- :TODO: check this -->

You can declare local variables within functions which reference storage variables. Modifying data via references will modify the persistent storage data the reference is bound to. Conceptually this is the same as a JavaScript or C reference- a new memory pointer was created to store a reference to another piece of (storage) memory that was already present. 

There is no OO-like 'static' in the sense of shared memory space on the class that is accessible by all instances of an object. To achieve such an outcome, one would need to deploy a separate shared storage contract to the blockchain and reference its address onto each of your own compiled contracts.

Deleting state variables can be done with the `delete` operator. Note however that since *contract storage is statically assigned at the time of contract creation*, there is really no such thing as "delete". What the operator really does is set the value to the initial value for the type, ie. `x = 0` for integers. <!-- :TODO: can you run `delete` on local variables referencing storage? Compiler error or no-op? -->


---
### Byte arrays

- variable byte arrays: `bytes`
- strings (character arrays): `string` (like `bytes`, but respects encoding rules)
    - note string literals will be encoded as `bytes` where possible

---
### Reference arrays

Types of arrays:

- 'fixed byte arrays' you have already seen- actually these are just different ways of talking about integers (256 bits === 32 bytes; `bytes32` is really just `uint256` by a different name).
- fixed-length: 
    - Type[Size] eg. `byte[4]`
- dynamic-length:
    - Size is optional, when ommitted the array length is dynamic- `int8[]`
    - `bytes` acts identically to `uint8[]` or `byte[]`, but is stored without padding and thus packed more tightly in function call data. Use it, it's cheaper!

Arrays can be multidimensional eg. `byte[][]`, `byte[][3]` etc. **Careful, C programmers**:

- *"5 dynamic arrays of `uint`"* is `uint[][5]`
- *"a dynamic array of 5-length arrays of `uint`s"* is `uint[5][]`

Arrays are declared as above, instantiated with the `new` keyword: `uint[] memory a = new uint[](7);`. The parameter to the function is the initial starting size.

Arrays and `bytes` both have a `length` member and a `push` method that most will be familiar with. <!-- :TODO: can bytes be longer than 32? -->

---
#### Caveats

- Array type is weird and depends on the most generic type of its contents. So an array with many `uint8`s in it will be interpreted as `uint8`, whereas one containing both `uint8` and `uint16` would be interpreted as `uint16`.
- Fixed-size and dynamically-sized arrays cannot be mixed *(yet- this is planned to be resolved in future)*
- Dynamic arrays cannot be returned from external contract function calls *(yet)*. However such return data *can* be retrieved by `web3.js`. <!-- :TODO: I suspect this is due to the need for a source file to map binary code against but need to check -->
- Never use `now` or `block.hash` as a source of randomness, unless you know what you are doing!
- `now` is the time of the last block, not *really* the exact current time.
- The constructor is removed from the contract code once it is deployed since it is only ever executed once.
- The max call stack size is 1024. *(Be sure to correctly handle the return value of `send`!)*  
  http://hackingdistributed.com/2016/06/16/scanning-live-ethereum-contracts-for-bugs/
  http://vessenes.com/ethereum-griefing-wallets-send-w-throw-considered-harmful/
  > Do not develop Solidity contracts without a reasonable grasp of the underlying Ethereum Virtual Machine execution model, particularly around gas costs. 
- manage your internal contract's state BEFORE calling other contracts. If they fail it's then THEIR problem, not yours.
- ALWAYS specify a gas amount when calling other contracts (which prevents them being attackable by sending any amount of gas)

    
http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/

- A purely functional language with a rich type system is needed. If we can't have that right now,
- All calls that send to untrusted address should have a gas limit
- Balances should be reduced before a send, not after one
- Events should probably have a Log prepended to their name.
- The splitDAO function should be mutexed and keep permanent track of the status of each possible splitter, not just through token tracking.


https://www.youtube.com/watch?v=3mgaDpuMSc0&feature=youtu.be&t=46m20s   (discussion on proof-based languages for smart contracts)


https://pdaian.com/blog/chasing-the-dao-attackers-wake/

> As a recommendation, do not call external contract code in your contract using Solidity’s call construct, ever if you can avoid it.  If you can’t, do it last and understand that you lose all guarantees as to the program flow of your contract at that point.


example @ http://vessenes.com/more-ethereum-attacks-race-to-empty-is-the-real-deal/


---
### Complex types

Can't be passed through external contract function calls. This is the difference between the *Contract ABI* (Application Binary Interface) and the *Solidity Language Interface*- the former is at an EVM level and can only understand basic memory types, the latter is at a language level and can understand the more complex structures and conveniences Solidity provides over the raw assembly instructions.

- mappings: 
    - are hashes which allow pretty much any value other than another mapping as keys.
    - are only allowed for state variables (or as storage reference types in internal functions).
    - are defined with type syntax eg. `mapping (uint => address) myAddresses;`.
- structs: C-like
    - can only be returned by internal functions, can't be used to pass data between contracts.
    - can be used inside mappings and arrays and they can themselves contain mappings and arrays.
    - can't be recursed.


---
## Addresses

The `address` type identifies an account (human or contract). It: 

- is equivalent to `uint160` (a 20-byte value), but is also exposed as an object with an interface by the language bindings
- accessible via `this` for the contract you're writing (remember, a deployed / running contract is just an object in memory). The current contract (and ONLY the current contract) can be destroyed by calling `selfdestruct(address recipient)` and passing the address to send any remaining funds stored in the contract to.
- You just wrap a constructor around an address to typecast it to the thing you know it is before calling its methods, or you can use types in the function signature too.

### attributes

- balance (in wei)

### methods

- send (send wei to address, returns FALSE on failure)  
    - The transfer fails if the call stack depth is at 1024 (this can always be forced by the caller) and it also fails if the recipient runs out of gas.
    - The contract's *fallback function* is called.
        - This is a function with no name declared within the contract. It handles the condition when someone sends ether to the contract but doesn't do anything else. Since this is generally the result of user error, you should most often provide this function as `function() { throw; }`.
- `call` & `delegatecall`
    - for calling other contracts which you don't yourself own(?)
    - kinda like calling a function by its name (PHP devs, your time to shine)
    ```
    address nameReg = 0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2;
    nameReg.call("register", "MyName");
    nameReg.call(bytes4(sha3("fun(uint256)")), a);
    ```
- callcode is just call without the `msg` object, don't bother with it
- doesn't allow you to access the return value
- returns a boolean indicating whether the invoked function terminated (true) or caused an EVM exception (false)

Note the syntax used above- the compiler will implicity apply the `address` interface to any account or contract<!-- or contracts only? --> addresses you define automatically.



---
# Control flow & syntax

- All the standard stuff, except `switch` and `goto` (thank god).
- No type coercion from `int` -> `bool`.
- Function calls are extremely cheap and implemented as `JUMP` inside the EVM, so no memory is cleared.
- Return types are specified in the function signature: `function func(uint k, uint) returns(uint) { //...`
- Tuples can be used to return and assign multiple values, denoted by parentheses:
  ```
    function f() returns (uint, bool, uint) {
        return (7, true, 2);
    }
  ```
- Named arguments (a bit Rust-like) are possible:
  ```
    contract C {
        function f(uint key, uint value) { /*...*/ }

        function g() {
            f({value: 2, key: 3});
        }
    }
  ```
- Order of expressions is undefined! Only guarantees are that all child statements are evaluated before the parent and that boolean short-circuiting works.
- Function-level scope, not block-level (like JavaScript ES5).
- `throw` to abort all processing so far (back to the previous external contract method call, anyway). Exceptions can't be caught, but you can use `call` and `delegatecall` to avoid the calling contract's execution halting.



---
# Function modifiers

These are special syntaxes defined within your contracts. The names given can be applied to functions in order to execute the modifier before the function runs. You can `throw` or `return` from these modifiers to prevent the function from being called.

    modifier onlyOwner {
        if (msg.sender != owner)
            throw;  
        _   // the underscore will be replaced with the invoked function by the compiler
    }

    function destroy onlyOwner () { 
        //...
    }

Modifiers can accept arguments, which are referenced from contract state variables. They are inheritable and overridable like normal methods. Multiple modifiers are evaluated left to right.



---
# Contract structure

- Constructors have the same name as the class
- Contracts containing methods with no body are interfaces (same syntax as C++, including semicolon instead of function body)
- Inheritance is concatenative (code from base contracts is copied into final contracts)
- Multiple inheritance is possible, behaves like virtual inheritance in C++. Apparently we haven't learned- just because it's there doesn't mean you should use it. Uses C3 linearization like in Python to deal with the 'Diamond Problem'. Specify multiple base classes in order from most base to most derived to avoid compile-time errors.
- Overriding methods is possible:
    - Parent class methods can be called explicitly, or dynamically using `super`.
    - All of this behaves in the normal way virtual method lookups work in most OO languages.
- Parent class constructors with arguments take those in the contract definition, eg. `contract MyFeed is owned, mortal, named("MyFeed") { //...`
- Where dynamic arguments are needed in the parent class constructor, you apply them to the constructor of your child class using a modifier:
  ```
  contract MyFeed is owned, mortal {
    function MyFeed(string name) named('MyFeed-' + name) {
      // ...
    }
  }
  ```





---
# Constants

An important optimisation is to use the `constant` modifier when declaring contract variables that don't change. The compiler will substitute the raw value for the variable and skip reserving memory storage for it. You can use basic integer arithmetic in these assignments.

    contract C {
        uint constant x = 32**22 + 8;
        string constant text = "abc";
    }




---
# Method visibility

On top of the usual, there is an extra distinction on method visibility: `external` vs `internal`.

- `external`: kinda like only being callable from an external thread. Other contracts can call this method, and we ourselves must call it in that way.
- `public`: callable from external contracts, as well as internally (default)
- `internal`: similar to `protected`- obviously only internally callable since you need to define a subclass in order to inherit
- `private`: only this contract, only internally

Note that these are only access specifiers enforced by the EVM and in no way hide information contained within your contracts.  
Everything is public on the blockchain. *(\*discounting things like zero-knowledge proofs)*

The compiler automatically creates accessor functions of the same name for all public state variables.




---
# Contracts calling contracts

http://ethereum.stackexchange.com/q/2070/2665

As mentioned, the EVM has many languages which compile down to its CPU bytecode. As such, there is a lower-level API available between contracts with a more restricted set of datatypes (known as the ABI) which must be used when calling between them. This also applies even when calling a contract's own methods via the `this` pointer.

- Internal contract methods and methods of superclasses: All Solidity datatypes allowed, accessed directly
- Other contract methods: Only ABI datatypes allowed, accessed via `call` and `delegatecall`

*However*- watch this space. I strongly suspect that if one has access to the source code of a contract then it could be applied over an address where said contract has been uploaded as a typecast in future (ie. `KnownContract(0x123ABetc)`), as is done with project contracts. 

<!-- 
:TODO: 
- well, this seems to contradict that assumption (from docs):
    > If a contract wants to create another contract, the source code (and the binary) of the created contract has to be known to the creator. This means that cyclic creation dependencies are impossible.
- might be able to test this in Mix- see if source can be associated with an address manually on the testnet after clearing Mix settings 
-->




---
# Library code

A code library in Ethereum is just a contract declared with the `library` keyword instead of `contract`. Libraries can have no `storage` of their own and are always compiled to `delegatecall` by the compiler.

When deploying, the library will actually be deployed to a separate contract on the blockchain. <!-- :TODO: this is interesting cos it means you pretty well *can* just apply a c'tor over an address and interface with it. Is interfacing with other contracts via `delegatecall` any different? -->

It's important to note the importance of the `storage` keyword in function parameters for libraries. Without this keyword, functions will create a deep copy of any arguments passed in, which is not only expensive in memory consumption but also means that modifying storage directly via library methods would not be possible- which is where the power of `delegatecall` comes from.
<!-- :TODO: can you pass memory values in as `storage` args? -->

> If you use libraries, take care that an actual external function call is performed.

> calls to library functions look just like calls to functions of explicit base contracts (`L.f()` if `L` is the name of the library).







---
# What are contract events for?

Don't worry- this is not some kind of horrendous two-way data binding thing. Events allow you to send data out of the blockchain without storing that information permanently on-chain - *(though note the contract bytecode could potentially be analysed and re-run by anyone anywhere in order to listen for and reproduce what was fired out.)*

Consider the following situation:

- You create a contract called `MyBank`, which simply stores a ledger of user balances in exchange for ether. You deploy an instance of this contract as *"The MyBank"* onto the blockchain. You would like users to not only be able to store tokens within your bank, but be notified when others make deposits and withdrawals.
- When a user makes a transaction with *The MyBank*, this updates the user's internal balance of some token within the contract.
- Within the *The MyBank* contract stored on the blockchain, we simply want to change the user's balance and store the new value. 
    - This balance can be read by anyone, but is only read within our Dapp in order to show it to the owning user. Reading the balances of all users would quickly exhaust browser memory.
- We can use contract events to broadcast the fact that a transaction happened without having to store the time, value and account ID for every transaction on-chain. We don't need to store this sort of data- it's automatically updated and archived at each step of the EVM's execution!

*Note loose use of the term "user" &mdash; which could in fact be another contract interacting with 'The MyBank' instead of a person!*

---
## Event interface

> The main advantage of events is that they are stored in a special way on the blockchain so that it is very easy to search for them.

http://ethereum.stackexchange.com/a/1905/2665

So basically they're ways of easily exposing data to external callers. The transaction log mechanism is used for this.

You can mark event parameters as `indexed`, which will display them as topics in the transaction log explorer and allow searching on them. This is important in the JavaScript layer of your Dapps, as filtering the event data from the chain transaction logs is the only way to listen for particular events. Perhaps easiest explained by example:
    
    // Contrived contract source:

    contract MyBank {
        mapping(address, uint) balances;

        event TransactionMade(address indexed user, uint newBalance, uint timestamp);
        
        function makeTransaction(uint value) {
            balances[msg.sender] += value;

            // note that you don't really need the timestamp, since the presumption is that this happened 'right then'
            TransactionMade(msg.sender, balances[msg.sender], now);    
        }
    }

    // Dapp JavaScript:

    var event = myContractInstance.TransactionMade();
    event.watch((err, result) => {
        console.log('Someone made a transaction:', result);
    });

    var meEvent = myContractInstance.TransactionMade({ user: web3.eth.defaultAccount });
    meEvent.watch((err, result) => {
        console.log('I made a transaction:', result);
    });

    // both above callbacks fire with `web3.eth.defaultAccount` and `23`
    // `event.watch` will be fired if any other user makes a transaction as well
    myContractInstance.makeTransaction(23);    

<!-- :TODO: above needs testing -->

> Note the dichotomy that a contract can't access events and web3.js is needed, but web3.js can't access return values from a contract invocation. So a pattern of using both an event and a return value like this may be often needed where responding to an event both on and off-chain is desired:

    event FooEvent(uint256 n);

    function foo() returns (uint256) {
      FooEvent(1337);
      return 1337;
    }





---
# Code best-practises

### Iteration vs recursion

The EVM has an artificial stack depth limit of 1024 to prevent runaway contracts from executing recursion-based exploits. This safeguard is the only reason The DAO wasn't *completely* drained, so it's a good thing to have. Unfortunately it also essentially obviates recursion-based language design... unless a very interesting compiler is designed!

Only external function calls have an impact on stack depth. Internal functions are implemented as `JUMP` instructions within the virtual CPU. Library function calls count towards stack depth, inherited functions don't. Keep these factors in mind when designing your contracts.

---
### Mapping vs. Array

http://ethereum.stackexchange.com/a/2597/2665

> mapping is generally recommended. For this use case of a contract, which could have an unlimited number of documents, which could be updated, the recommendation holds.

> The main advantage of an array is for iteration. But the iteration needs to be limited, not only for speed, but potentially for security. As an extreme example, a permanent Denial-of-Service could be inflicted on a contract if its service involves iterating over an array that an attacker can fill up, such that the cost of iteration and operation permanently exceeds the block gas limit.

> A comment by @PaulS suggests that iterating an array of length 50 is relatively efficient; testing the use cases is advised to also identify details such as desired or acceptable gas costs.

---
### Composition or inheritance

http://ethereum.stackexchange.com/a/2222/2665

> Internal function calls are compiled as simple jumps inside the EVM. Thus only difference would be an extra JUMP operation for the function call balanced by perhaps shorter code overall.

Therefore, as a general rule functional composition is a pretty good way to go, and you can feel good about breaking your code up into smaller methods.

> Even if a contract inherits from multiple other contracts, only a single contract is created on the blockchain, the code from the base contracts is always copied into the final contract.

Contatenative inheritance means you won't save on chain storage costs by breaking your contracts up into smaller classes. <!-- :TODO: test this --> In fact, probably quite the opposite due to the number of extra methods this architecture will likely introduce.

If you're concerned about bytecode storage size, use libraries to organise your shared code instead of base contracts. Ideally base contracts should be kept as lean as possible, since they'll be duplicated every time you deploy a new derived contract that extends from them.

---
### Delegates

`delegatecall` is the solution for structuring your pure library code: allowing you to put common code in places and run it without polluting method namespace of contracts you're creating. Note that you don't even have to use the method manually- when you use Libraries with Mix, the IDE will automatically link your contracts and allow you to write the call as if it were a normal contract within your project.


---
### Misc gotchas

- Always call local methods in aliased form, ie. call `f()`, not `this.f()`. The former is faster as it allows pass-by-reference- _once you call between contracts, data must be copied by value_.

> Internal function calls have the advantage that you can use all Solidity types as parameters, but you have to stick to the simpler ABI types for external calls.

<!-- :TODO: this seems to conflict with the definition of Library linkage ("take care that..."). Which again seems to imply that directly binding a known template to an existing on-chain contract is possible! -->




---
# Inline assembly

You can write inline assembly, too! - http://solidity.readthedocs.io/en/latest/control-structures.html#inline-assembly  

    library VectorSum {
        // This function is less efficient because the optimizer currently fails to
        // remove the bounds checks in array access.
        function sumSolidity(uint[] _data) returns (uint o_sum) {
            for (uint i = 0; i < _data.length; ++i)
                o_sum += _data[i];
        }

        // We know that we only access the array in bounds, so we can avoid the check.
        // 0x20 needs to be added to an array because the first slot contains the
        // array length.
        function sumAsm(uint[] _data) returns (uint o_sum) {
            for (uint i = 0; i < _data.length; ++i) {
                assembly {
                    o_sum := mload(add(add(_data, 0x20), i))
                }
            }
        }
    }

Rather nice- brackets instead of `PUSH` commands... but this feature is highly experimental. You can even do things like reading the bytecode of another contract into memory... <!-- :TODO: can you do this with LLL?! -->




---
# TheDAO hack: what went wrong?

All discussion of *'The DAO'* refers to The DAO v1.0- https://github.com/slockit/DAO/tree/v1.0

Spot the bug:


    function splitDAO(
        uint _proposalID,
        address _newCurator
) noEther onlyTokenholders returns (bool _success) {
    
        // ...

        // Burn DAO Tokens
        Transfer(msg.sender, 0, balances[msg.sender]);
        withdrawRewardFor(msg.sender); // be nice, and get his rewards
        totalSupply -= balances[msg.sender];
        balances[msg.sender] = 0;
        paidOut[msg.sender] = 0;
        return true;
    }

    // ...

    function withdrawRewardFor(address _account) noEther internal returns (bool _success) {
            if ((balanceOf(_account) * rewardAccount.accumulatedInput()) / totalSupply < paidOut[_account])
                throw;

            uint reward =
                (balanceOf(_account) * rewardAccount.accumulatedInput()) / totalSupply - paidOut[_account];
            if (!rewardAccount.payOut(_account, reward))
                throw;
            paidOut[_account] += reward;
            return true;
    }

    // ...


    function payOut(address _recipient, uint _amount) returns (bool) {
        if (msg.sender != owner || msg.value > 0 || (payOwnerOnly && _recipient != owner))
            throw;
        if (_recipient.call.value(_amount)()) {
            PayOut(_recipient, _amount);
            return true;
        } else {
            return false;
        }
    }

---
## Short version

<!-- :TODO: yeah need more here! -->

- `splitDAO`(1) calls `withdrawRewardFor` calls `payOut`.
- `payOut` returns false if transferring the balance to the recipient of the split fails. I am reasonably sure this is good architecture- it allows `payOut` to be safely used on arrays of addresses to refund in bulk.
- However, `withdrawRewardFor` throws if `rewardAccount.payOut` fails! This causes the entire operation any calls to `withdrawRewardFor
- But, `splitDAO` is public...
- So the attacker can use a default function in their own contract (fired when `payOut` runs `_recipient.call.value(_amount)()`) to call `splitDAO` *while the original `splitDAO` call is still running*...
    - `splitDAO`(2) calls `withdrawRewardFor` calls `payOut`...
    - The original call (1) to `splitDAO` has still not run `balances[msg.sender] = 0;`... so `payOut` transfers the same balance back to the attacking contract as before...
    - This continues until the artificial EVM stack depth limit is reached (1024).
- The original `payOut` function will eventually get back a 'stack depth limit exceeded' exception from the original `_recipient.call.value(_amount)()` and return `false`.
- The original `withdrawRewardFor` function *throws* - and the balances are never reset! It's as if the attacker never withdrew from The DAO in the first place.

<sub><a href="http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/">http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/</a></sub>

---
## Guidelines to avoid this pitfall

- Ensure you update your contract's own internal state **before** interacting with any external addresses. 
- If these interactions fail, handle the effect in a way which **does not interfere** with any other address being processed.
- Presume any methods in your contract other than `internal` and `private` ones will be called by contracts other than those you expect.
- Also never presume that an address === a user. An address does not guarantee a real person.
- Use `send` instead of `call` wherever possible <!-- :TODO: check this & understand the difference -->


---
# Solar storm?!

Not a real thing, really. This is just how you'd want programs to run, sometimes.

<!-- :TODO: checkCaller method decorator thing to ensure caller is an instance of something else? -->


---
# Towards a better language?







<!-- ---------------------------------------------------------------------------
PART 2: ARCHITECTURE
--------------------------------------------------------------------------- -->





---
# Unit tests are important

https://github.com/smartcontractproduction/sol-unit
- Simulates executing using the JavaScript VM https://github.com/ethereumjs/ethereumjs-vm
- Interface is a base `Test` contract providing assertion methods to be extended from, which should create instances of your testee contracts internally in order to run its tests.

https://github.com/androlo/sol-tester




---
# On-chain is not always the answer

http://ethereum.stackexchange.com/a/1518/2665

As pointed out in the above answer- maybe sorting an array on the blockchain is something that doesn't need to be done. A client application could sort the array before inserting onto the chain (provided you trust the client app to do the sorting, of course).




---
# Contract design patterns

Do you really want to make your contract self-destruct?

> If Ether is sent to removed contracts, the Ether will be forever lost.

<!-- :TODO: the docs say the contract will continue to be written to blocks if not removed, presume this is only for blocks that involve the contract but pays to check -->

https://ethereum.stackexchange.com/questions/1134/what-design-patterns-are-appropriate-for-data-structure-modification-within-ethe?newreg=c176baafe7254727b892b6c257938950

http://ethereum.stackexchange.com/questions/2159/guidelines-for-designing-contracts-to-handle-bugfixes/2162#2162

Redeploying at the same address is impossible.  
*(unless you can cause a hash collision hurrrr)*

> As for bugfixes, the common pattern is to have proxy or lookup contracts to be a gateway to the real one, which in case of a change or bugfix would be replaced. Replacing it also means losing the old storage contents.








---
# Contract base classes 

:TODO: 


---
# Function libraries

https://github.com/Arachnid/ens - Ethereum Name Service
https://github.com/Arachnid/solidity-stringutils
https://github.com/axic/density
https://github.com/axic/etherboard
https://github.com/chriseth/solidity-examples
https://github.com/dadaista/bitshelter
https://github.com/emailgregn/contracts
https://github.com/FrankHold/DApp_SyntheticTrader
https://github.com/JeffreyBPetersen/contract-testing
https://github.com/JeffreyBPetersen/data-sharing-contracts
https://github.com/nexusdev/dappsys
https://github.com/nickfranklinuk/canary
https://github.com/phillyfan1138/DArtist
https://github.com/smartcontractproduction/dao
https://github.com/zmitton/ethereum_escrow



---
# Some real stats: quicksort vs. heapsort

:TODO:





---
# Build toolchain

https://www.npmjs.com/package/dapple

Test suite built in!

https://github.com/nexusdev/dapple/blob/master/doc/test.md



---
## Observations:

- The risks are high with any on-chain language- no software stack to act as padding for bugs.
- Solidity is a means of direct manipulation of the blockchain database state.
    - State is evil! Uh-oh...
        - Recursive calling vulnerabilities happen due to errors in *ordering state manipulations*
        - Better code analysis tools are needed
        - Linters and unit tests need to be the norm, at minimum
        - Better languages are needed: OCaml or Haskell-like, code as provable theorems
- All external function calls are untrusted and could come in from anywhere.
- There are absolutely no guarantees as to another contract's state unless cryptographically provable to be authored from a given source code.
