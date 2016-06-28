name: base
layout: true

<!-- Remark template definitions -->

<header>
    <h6>Solidity &amp; Systems Programming on the Blockchain <span style="float: right;">13 Jul 2016</span></h6>
</header>

{{ content }}

<footer>
    <ul>
        <li><img src="./res/avatar_128x128-4.png" /><strong>pospi</strong></li>
        <li><i class="icon-link"></i> http://pospi.spadgos.com</li>
        <li><i class="icon-github"></i> https://github.com/pospi</li>
        <li><i class="icon-mail"></i> pospi@spadgos.com</li>
        <li><i class="icon-twitter"></i> https://twitter.com/pospigos</li>
    </ul>
</footer>

---
name: start
layout: true
background-image: url(./res/leaf.jpg)

<div class="slide-start">
    {{ content }}
    <ul>
        <li class="center"><strong>pospi</strong><br /><img src="./res/avatar_128x128-4.png" /></li>
    </ul><ul>
        <li><i class="icon-link"></i> http://pospi.spadgos.com</li>
        <li><i class="icon-mail"></i> pospi@spadgos.com</li>
        <li><i class="icon-github"></i> https://github.com/pospi</li>
        <li><i class="icon-twitter"></i> https://twitter.com/pospigos</li>
    </ul>
</div>

---
name: callout
layout: true
background-image: url(./res/leaf.jpg)

<div class="slide-callout">
{{ content }}
</div>

---
name: suggestion
template: base
layout: true
background-image: url(./res/leaf.jpg)

<div class="slide-suggestion">
    <h1>Suggestions</h1>
{{ content }}
</div>

---
name: default
template: base
layout: true

---
template: start





<!-- Begin presentation -->

# Solidity & Systems Programming on the Blockchain



---
# Agenda

.threecol[
<!-- 
    :IMPORTANT: 
    -> First two header levels are indexed, and must have `name` properties added to their slides.
    -> Other header levels can be used as internal headings within slides.
    -> H2 and H3 look the same
    -> We can declare repeated first and second-level headers by using HTML without MarkdownTOC 
       generating extra entries.
-->
<!-- MarkdownTOC depth=3 -->

- [Same concepts, different environment](#same-concepts-different-environment)
- [Solidity is not the end-all](#solidity-is-not-the-end-all)
- [Words of caution](#words-of-caution)
- [Best places to get started](#best-places-to-get-started)
- [Micro-optimisations are important](#micro-optimisations-are-important)
- [Quantifying 'efficiency'](#quantifying-efficiency)
- [A blockchain is not always the answer](#a-blockchain-is-not-always-the-answer)
- [Types](#types)
    - [Value types](#value-types)
        - [Constants](#constants)
    - [Reference types](#reference-types)
        - [Data location](#data-location)
        - [Handling Data location](#handling-data-location)
    - [Arrays](#arrays)
        - [Byte arrays](#byte-arrays)
        - [Reference arrays](#reference-arrays)
        - [Using arrays](#using-arrays)
        - [Array caveats](#array-caveats)
    - [Other reference types](#other-reference-types)
    - [Addresses](#addresses)
        - [Address methods](#address-methods)
        - [Address magic](#address-magic)
- [Control flow & syntax](#control-flow--syntax)
    - [Interpreter caveats](#interpreter-caveats)
    - [Function modifiers](#function-modifiers)
    - [Contract structure](#contract-structure)
    - [Method visibility](#method-visibility)
    - [Contracts calling contracts](#contracts-calling-contracts)
        - [Reference types and contract interfaces](#reference-types-and-contract-interfaces)
    - [Library code](#library-code)
        - [Libraries as datatypes](#libraries-as-datatypes)
    - [What are contract events?](#what-are-contract-events)
        - [Event interface](#event-interface)
        - [Event interface \(cot'd\)](#event-interface-cotd)
- [Code best-practises](#code-best-practises)
    - [Iteration vs recursion](#iteration-vs-recursion)
    - [Mapping vs. Array](#mapping-vs-array)
    - [Composition or inheritance](#composition-or-inheritance)
    - [Delegates](#delegates)
    - [Contract design patterns](#contract-design-patterns)
- [Inline assembly](#inline-assembly)
- [Some real stats: quicksort vs. heapsort](#some-real-stats-quicksort-vs-heapsort)
- [Misc gotchas](#misc-gotchas)
- [TheDAO hack: what went wrong?](#thedao-hack-what-went-wrong)
    - [Short version](#short-version)
    - [Guidelines to avoid this pitfall](#guidelines-to-avoid-this-pitfall)
- [Other 'vulnerabilities'](#other-vulnerabilities)
- [Towards a better language?](#towards-a-better-language)
- [In the meantime](#in-the-meantime)
- [Contract base classes](#contract-base-classes)
- [Function libraries](#function-libraries)
- [Final observations:](#final-observations)
- [Thanks!](#thanks)

<!-- /MarkdownTOC -->
]






---
name: same-concepts-different-environment
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

**Ethereum is a low-level system**. Think of it like programming for an Arduino board, Onion Omega or Raspberry Pi. Resources are extremely scarce. There isn't even a floating point unit (yet!).

???

:TODO: Needs chain / EVM / Solidity picture






---
name: solidity-is-not-the-end-all
# Solidity is not the end-all

Serpent and LLL can also be written, and likely more efficiently (LLL in particular). Try them all out in-browser!

- https://ethereum.github.io/browser-solidity/ - Solidity scripting
- http://etherscripter.com - visual code editor, Serpent and LLL scripting

All compile to EVM bytecode. Solidity was not the first EVM-compiled language, and it will not be the last.

Solidity is also arguably not very well suited to the task &mdash; see The Great DAO Hack! We'll come back to this later...






---
name: words-of-caution
# Words of caution

> Do not develop Solidity contracts without a reasonable grasp of the underlying Ethereum Virtual Machine execution model, particularly around gas costs.
>
> <cite>http://www.kingoftheether.com/postmortem.html</cite>

Statements like this should give us *all* pause for thought here. But please, don't let this dissuade you from experimenting! The only way to learn is to tinker and reflect&mdash; that's what the testnet and the community are for.

???

:TODO: more stuff about buffer of a larger system between user input and storage






---
name: best-places-to-get-started
# Best places to get started

- http://solidity.readthedocs.io/ (most complete reference material I could find)
- https://ethereumbuilders.gitbooks.io/guide/ (an oldie but a goodie, also contains some Serpent documentation)
- https://docs.erisindustries.com/tutorials/solidity/ 

???

:TODO: QA eris docs, may be framework-specific








---
name: micro-optimisations-are-important
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







---
name: quantifying-efficiency
# Quantifying 'efficiency'

Three metrics: gas cost (in `wei`), reserved storage size (in `bytes`) & bytecode size (also measurable in `bytes`). Note that contract storage is statically allocated *once* at the time you deploy a contract and its size never changes thereafter, so some interfaces may give you back a single value for *'contract size'* at the time of compilation.

***Relative importance: gas cost > storage size > bytecode size.***

In general, you will want to prioritise architectural decisions in this order. Note that performance (in terms of speed) should **not** be a concern to you. *"CPU-intensive"* in this environment means on the order of sorting an array of more than 50 elements&mdash; not much horsepower at all!

- Prioritise the gas cost of interacting with your contracts above all else. Some statisticians have claimed that a single bitcoin transaction causes as much CO<sub>2</sub> pollution as keeping a car on the road for *3 days*. Remember that all computation costs energy and that your effects here are amplified drastically by the size of the network.
- Storage and bytecode size are equivalent priorities, but storage is more under your control:
    - Be dilligent about utilising contract storage variables fully and allocating as little space as possible for dynamic arrays. 
    - Learn to understand how the Solidity compiler handles your code and build up a library of optimal libraries and algorithms for common tasks. Use Mix or your test framework to compare bytecode sizes for contract generation.





---
name: a-blockchain-is-not-always-the-answer
# A blockchain is not always the answer
 
CPU-intensive operations like sorting large arrays should be placed off-chain and run by a trusted party. Note also that the results of such computations are easily auditable by running parallel off-chain proofing servers to verify the primary server's on-chain output/input, and can be easily managed via `Owned` contract base classes and `OwnerOnly` function modifiers (to be examined later).







---
name: types
.left-column[
# Types
]
.right-column[

Solidity has the usual memory-centric datatypes we're used to seeing in low-level languages, with some modern conveniences baked in to the compiler.

Its reference types take on an additional attribute in their *"context"*- defined as either `storage` or `memory`. This language keyword is all that is needed to differentiate between persistent data stored on-chain and transient data used during intermediate computations.
]

???
:TODO: this is actually probably a good place to go into detail about how RAM & disk are merged






---
name: value-types
.left-column[
<h1>Types</h1>
## Value types
]
.right-column[

- integers: `int8`..`int256`, `uint8`..`uint256`
    - without the qualifier will use the `*256`-sized types
- `bool` 
    - uses 1 byte for storage
- fixed byte arrays: `byte`/`bytes1`..`bytes32`
    - actually these are just different ways of talking about integers (256 bits === 32 bytes; `bytes32` is really just `uint256` by a different name).
    - assignment must be done with bitwise operators currently; eg. `byteArr |= newVal << (newIdx << 3)` to set the `newIdx`th value to `newVal`. 
    - has a `length` attribute
- No floats, but fixed-point math is built in to the syntax
    - see `ufixed8x248`, `ufixed128x128` and similar types- 
    - FPU "coming soon". I wouldn't be surprised if this does not come until Ethereum 2.0 (proof of stake). If a Nintendo DS is too low-powered for one, then the EVM *definitely* is.
- enums (c-like, stored as smallest possible `int` type)
    - When passed over the ABI, will be coerced: given `enum ActionState { Started, Stopped }`, `StartAction == 0` etc
- time units and ether units can all be entered literally for convenience and are interpreted as the base type (`wei` and `second`). `2 ether == 2000 finney`, `1 minutes == 60 seconds` etc. Note that all arithmetic uses ideal time and does not account for timezones, leap seconds or otherwise.
]

???
:TODO: check your bit-math, guy :p





---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
### Constants
]
.right-column[

An important optimisation is to use the `constant` modifier when declaring contract variables that don't change. The compiler will substitute the raw value for the variable and skip reserving memory storage for it. You can use basic integer arithmetic in these assignments.

```
contract C {
    uint constant x = 32**22 + 8;
    string constant text = "abc";
}
```

]





---
name: reference-types
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
## Reference types
]
.right-column[

### Data location

For reference types, we have to think about whether the data they reference is only kept in `memory` while the EVM is running this execution cycle, or if they should persist to `storage`. If you continue to think of contracts the same as classes, then these semantics should follow:

> The default for function parameters (including return parameters) is memory, the default for local variables is storage and the location is forced to storage for state variables (obviously).

- Contracts ~= Classes
- Deployed contracts ~= Objects
- Contract functions ~= Object methods
- State (`storage`) variables ~= Instance variables
]

???
:TODO: 
- picture
- work out what up with the above comment cos surely not every locally assigned variable in a function persists






---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
]
.right-column[

### Handling Data location

You must declare `storage` in your function signatures if you want to operate on storage data without it being copied into memory first (which is an expensive operation). All memory keeps its existing context except for when storage data is passed in as a non-storage function parameter.

You can declare local variables within functions which reference storage variables. Modifying data via references will modify the persistent storage data the reference is bound to. Conceptually this is the same as a JavaScript or C reference- a new memory pointer was created to store a reference to another piece of (storage) memory that was already present. Storage addresses and memory addresses are all part of a single address space as far as the EVM operates.

There is no OO-like 'static' in the sense of shared memory space on the class that is accessible by all instances of an object. To achieve such an outcome, one would need to deploy a separate shared storage contract to the blockchain and reference its address onto each of your own compiled contracts.

Deleting state variables can be done with the `delete` operator. Note however that since *contract storage is statically assigned at the time of contract creation*, there is really no such thing as "delete". What the operator really does is set the value to the initial value for the type, ie. `x = 0` for integers. Because of this, some weird caveats apply when attempting to delete references to already deleted storage variables - you should really always be addressing the full path to the data you are deleting in any case.
]

???
:TODO: check whether memory keeping context is glossing over it or OK to say

:TODO: add another slide with an example of what 'handling data location' looks like in say node vs eth




---
name: arrays
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
## Arrays
]
.right-column[

### Byte arrays

- variable byte arrays: `bytes`
- strings (character arrays): `string` (like `bytes`, but respects encoding rules)
    - note string literals will be encoded as `bytes` where possible

### Reference arrays

- fixed-length: 
    - Type[Size] eg. `byte[4]`
- dynamic-length:
    - Size is optional, when ommitted the array length is dynamic- `int8[]`
    - `bytes` acts identically to `uint8[]` or `byte[]`, but is stored without padding and thus packed more tightly in function call data. Use it, it's cheaper!
]

???
:TODO: can bytes be longer than 32?






---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
]
.right-column[

### Using arrays

Arrays can be multidimensional eg. `byte[][]`, `byte[][3]` etc. **Careful, C programmers**:

- *"5 dynamic arrays of `uint`"* is `uint[][5]`
- *"a dynamic array of 5-length arrays of `uint`s"* is `uint[5][]`

Arrays are declared as above, instantiated with the `new` keyword: `uint[] memory a = new uint[](7);`. The parameter to the function is the initial starting size.

Arrays and `bytes` both have a `length` member and a `push` method that most will be familiar with.
]






---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
]
.right-column[

### Array caveats

- Array types will be coerced to the most generic type of its contents. So an array with many `uint8`s in it will be interpreted as `uint8`, whereas one containing both `uint8` and `uint16` would be interpreted as `uint16`.
- Fixed-size and dynamically-sized arrays cannot be mixed *(yet- this is planned to be resolved in future)*
- Dynamic arrays cannot be returned from external contract function calls *(yet)*. However such return data *can* be retrieved by `web3.js` in the browser layer of your Dapps.
]

???
:TODO: I suspect this is due to the need for a source file to map binary code against but need to check







---
name: other-reference-types
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
## Other reference types
]
.right-column[

The full suite of low-level tools for organising and rationalising information is available...

.twocol[
#### mappings:

Are defined with type syntax eg. `mapping (uint => address) myAddressList;`

- are hashes which allow pretty much any value other than another mapping as keys.
- **are only allowed for state variables** (or as storage reference types in internal functions).

#### structs: 

C-like, eg:

```
struct Funder {
    address addr;
    uint amount;
}
```

- can only be returned by internal functions, can't be used to pass data between contracts.
- can be used inside mappings and arrays and they can themselves contain mappings and arrays.
- can't be recursed / defined in terms of themselves.

<br />
]
]

???
:TODO: needs picture for ABI/Solidity/other languages interaction

:TODO: can't remember if these structs mentioned are just other words for mappings or something else.. wrote this a long time ago :/







---
name: addresses
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
<h2>Other reference types</h2>
## Addresses
]
.right-column[

The `address` type identifies an account (human or contract). It: 

- is equivalent to `uint160` (a 20-byte value), but is also exposed as an object with an interface by the language bindings
- accessible via `this` for the contract you're writing (remember, a deployed / running contract is just an object in memory). The current contract (and ONLY the current contract) can be destroyed by calling `selfdestruct(address recipient)` and passing the address to send any remaining funds stored in the contract to.
- All addresses have a `balance` attribute for accessing the balance of that contract or user.
- You just wrap a constructor around an address to typecast it to the thing you know it is before calling its methods, or you can use types in the function signature too.
]

???
:TODO: needs example of typecasting







---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
<h2>Other reference types</h2>
<h2>Addresses</h2>
]
.right-column[

### Address methods

All these members of the `address` type are made available by the compiler for you:

- `send(val)` (send `val` wei to address, returns `false` on failure)  
    - The transfer fails if the call stack depth limit is exceeded, or the recipient runs out of gas.
    - The contract's *fallback function* is called.
        - This is a function with no name declared within the contract. It handles the condition when someone sends ether to the contract but doesn't do anything else. Since this is generally the result of user error, you should most often provide this function as `function() { throw; }`.
- `call` & `delegatecall`
    - For calling other contracts which you don't yourself own or interacting with library contracts (to be discussed soon!)
    - Works like JavaScript's `call` method, kinda like calling a function by its name.
- `callcode` is just `call` without the `msg` object, don't bother with it
- none of these methods allow you to access the return value
- all return a boolean indicating whether the invoked function terminated (`true`) or caused an EVM exception (`false`)
]

???
:TODO: should ensure that addresses behave the same for contracts and humans

:TODO: need to find out how to get return values out of calling other contracts' methods (internal and external ones)







---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
<h2>Other reference types</h2>
<h2>Addresses</h2>
]
.right-column[

### Address magic

Note the compiler will implicity apply the `address` interface to any literal account or contract addresses you define automatically:

```
address nameReg = 0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2;
nameReg.send(4 ether);
```

This is extremely handy when it comes to contracts calling contracts...
]







---
name: control-flow--syntax
.left-column[
# Control flow & syntax
]
.right-column[

- All the standard C stuff: `if`, `else`, `for`, `while`, `break`, `continue` and `return`. No `switch` or `goto`, by design (generally not performant logic structures).
- No type coercion from `int` -> `bool`, you need to do this manually when checking conditions based on integral types.
- Return types are specified in the function signature: 
  ```
    function func(uint k, uint) returns(uint) {
        //...
    }
  ```
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

]

???
:TODO: can tuples be unpacked, or are they just for handling function args?





---
name: interpreter-caveats
.left-column[
<h1>Control flow & syntax</h1>
## Interpreter caveats
]
.right-column[

- Order of expressions is undefined! Only guarantees are that all child statements are evaluated before the parent and that boolean short-circuiting works.
- Function-level scope, not block-level (like JavaScript ES5).
- Exceptions are very limited and are designed to offer as few guarantees as possible. Simply `throw` to abort all processing so far (back to the previous external contract method call, anyway). Exceptions can't be caught, but you can use `call` and `delegatecall` to prevent exceptions in the target contract's execution from halting your own.
]





---
name: function-modifiers
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
## Function modifiers
]
.right-column[

These are special syntaxes defined within your contracts. The names given can be applied to functions in order to execute the modifier before the function runs. You can `throw` or `return` from these modifiers to prevent the function from being called.

```
modifier onlyOwner {
    if (msg.sender != owner)
        throw;
    _   // the underscore will be replaced with the invoked function by the compiler
}
    
function destroy onlyOwner () { 
    suicide(msg.sender);
}
```

Modifiers can accept arguments, which are referenced from contract state variables. They are inheritable and overridable like normal methods. Multiple modifiers are evaluated left to right.
]

???
:TODO: more examples, examples of collapsing conditions






---
name: contract-structure
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
## Contract structure
]
.right-column[

- Inheritance is concatenative (code from base contracts is copied into final contracts). Keep this in mind as reusing base classes will not reduce compiled bytecode size.
- Constructors have the same name as the class.
- Contracts containing methods with no body are interfaces (same syntax as C++, including semicolon instead of function body)
- Multiple inheritance is possible, behaves like virtual inheritance in C++. Apparently we haven't learned- just because it's there doesn't mean you should use it!
- Overriding methods is possible:
    - Parent class methods can be called explicitly, or dynamically using `super`.
    - All of this behaves in the normal way virtual method lookups work in most OO languages.
- Parent class constructors with arguments take those in the contract definition. Where dynamic arguments are needed in the parent class constructor, you apply them to the constructor of your child class using a modifier. The following two contracts are equivalent with the exception of the dynamic parameter:
  ```
    contract MyFeed is owned, mortal, named("MyFeed") {
        // ...
    }

    contract MyFeed is owned, mortal {
        function MyFeed(string name) named("MyFeed-" + name) {
            // ...
        }
    }
  ```
]

???
:TODO: generally more examples & testing of examples needed...

```
contract InterfaceExample {
    function interfaceMethod() returns(uint);
}

contract AnotherInterface is InterfaceExample {
    function interfaceMethod2() returns(uint);
}

contract NamedContract {
    string name;

    function NamedContract(string myName) {
        name = myName;
    }
}

contract ExampleContract is InterfaceExample {
    address owner;

    function ExampleContract() {
        owner = msg.sender;
    }

    function interfaceMethod() returns(uint) {
        return 8;
    }
}

contract OverridingContract is ExampleContract, AnotherInterface {
    function OverridingContract(string name) NamedContract('Overriding-' + name) {
        // ...
    }

    function interfaceMethod() returns(uint) {
        return 3;
    }

    function interfaceMethod2() returns(uint) {
        return interfaceMethod();
    }
}
```






---
name: method-visibility
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
## Method visibility
]
.right-column[

On top of the usual, there is an extra distinction on method visibility: `external` vs `internal`.

- `external`: Other contracts can call this method, and we ourselves *must* call it in that way.
- `public`: callable from external contracts, as well as internally (default)
- `internal`: similar to *"protected"* in C++ and obviously only internally callable since you need to define a subclass in order to inherit
- `private`: only this contract, only internally

Note that these are only access specifiers enforced by the EVM and in no way hide information contained within your contracts&mdash; they merely control how it can be manipulated.  
**Everything is public on the blockchain** <sub>*<em>(discounting things like zero-knowledge proofs)</em></sub>

Note that the compiler automatically creates accessor functions of the same name for all public state variables.
]






---
name: contracts-calling-contracts
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
## Contracts calling contracts
]
.right-column[

As mentioned, the EVM has many languages which compile down to its CPU bytecode. As such, there is a lower-level API available between contracts with a more restricted set of datatypes (known as the *Contract ABI* or *"Application Binary Interface"*) which must be used when calling between them (Serpent doesn't know about the types of data structures Solidity supports, for example). This also applies even when calling a contract's own methods via the `this` pointer.

.caveat[Method access operates very differently depending on the calling context.]  
.caveat[External function call stack depth is hard-limited to 1024 calls.]

- Internal function calls are extremely cheap and implemented as `JUMP` inside the EVM, so no memory is cleared.
- External function calls (`send`, `call`, calling via `this` and calling library methods) contribute to stack depth and cannot recurse in excess of an artificial stack depth limit of 1024.
]

???
:TODO: picture needed

:TODO: http://ethereum.stackexchange.com/q/2070/2665






---
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
]
.right-column[
### Reference types and contract interfaces

Solidity's more complex datatypes can't be passed through external contract function calls. This is the difference between the  and the *Solidity Language Interface*- the former is at an EVM level and can only understand basic memory types, the latter is at a language level and can understand the more complex structures and conveniences Solidity provides over the raw assembly instructions and type interpretations.

- Internal contract methods and methods of superclasses: All Solidity datatypes allowed, accessed directly
- Other contract methods: Only ABI datatypes allowed, accessed via `call` and `delegatecall`

*However*- watch this space. I strongly suspect that if one has access to the source code of a contract then it could be applied over an address where said contract has been uploaded as a typecast in future (ie. `KnownContract(0x123ABetc)`), as is done with project contracts. 
]

???
:TODO: 
well, this seems to contradict that assumption (from docs):

> If a contract wants to create another contract, the source code (and the binary) of the created contract has to be known to the creator. This means that cyclic creation dependencies are impossible.

might be able to test this in Mix- see if source can be associated with an address manually on the testnet after clearing Mix settings 






---
name: library-code
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
## Library code
]
.right-column[

A code library in Ethereum is just a contract declared with the `library` keyword instead of `contract`. Libraries can have no `storage` of their own and are always compiled to `delegatecall` by the compiler.

> If you use libraries, take care that an actual external function call is performed.

.caveat[When deploying, the library will actually be deployed to a separate contract on the blockchain.] All external function call rules apply.

It's important to note the importance of the `storage` keyword in function parameters for libraries. Without this keyword, functions will create a deep copy of any arguments passed in, which is not only expensive in memory consumption but also means that modifying storage directly via library methods would not be possible- which is where the power of `delegatecall` comes from.

> calls to library functions look just like calls to functions of explicit base contracts (`L.f()` if `L` is the name of the library).

]

???
:TODO: can you pass memory values in as `storage` args?

:TODO: this is interesting cos it means you pretty well *can* just apply a c'tor over an address and interface with it. Is interfacing with other contracts via `delegatecall` any different?

If this turns out to be the case then *All external function call rules apply.* no longer applies!






---
name: libraries-as-datatypes
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
<h2>Library code</h2>
### Libraries as datatypes
]
.right-column[
The most useful application of libraries appears to be as extensions to the core datatypes available in the language. For example (taken from the docs), given the library:

```
library Set {
    // We define a new struct datatype that will be used to
    // hold its data in the calling contract.
    struct Data { mapping(uint => bool) flags; }
  
    // Note that the first parameter is of type "storage
    // reference" and thus only its storage address and not
    // its contents is passed as part of the call.  This is a
    // special feature of library functions.  It is idiomatic
    // to call the first parameter 'self', if the function can
    // be seen as a method of that object.
    function insert(Data storage self, uint value)
        returns (bool)
    {
        if (self.flags[value])
            return false; // already there
        self.flags[value] = true;
        return true;
    }
  
    function remove(Data storage self, uint value)
        returns (bool)
    {
        if (!self.flags[value])
            return false; // not there
        self.flags[value] = false;
        return true;
    }
  
    function contains(Data storage self, uint value)
        returns (bool)
    {
        return self.flags[value];
    }
}
```

]

???
:TODO: finish this





---
name: what-are-contract-events
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
<h2>Library code</h2>
## What are contract events?
]
.right-column[

Don't worry- this is not some kind of horrendous two-way data binding thing. Events allow you to send data out of the blockchain without storing that information permanently on-chain - *(though note the contract bytecode could potentially be analysed and re-run by anyone anywhere in order to listen for and reproduce what was fired out.)*

Consider the following situation:

- You create a contract called `MyBank`, which simply stores a ledger of user balances in exchange for ether. You deploy an instance of this contract as *"The MyBank"* onto the blockchain. You would like users to not only be able to store tokens within your bank, but be notified when others make deposits and withdrawals.
- When a user makes a transaction with *The MyBank*, this updates the user's internal balance of some token within the contract.
- Within the *The MyBank* contract stored on the blockchain, we simply want to change the user's balance and store the new value. 
    - This balance can be read by anyone, but is only read within our Dapp in order to show it to the owning user. Reading the balances of all users would quickly exhaust browser memory.
- We can use contract events to broadcast the fact that a transaction happened without having to store the time, value and account ID for every transaction on-chain. We don't need to store this sort of data- it's automatically updated and archived at each step of the EVM's execution!

<sub><em>*Note loose use of the term "user" &mdash; which could in fact be another contract interacting with 'The MyBank' instead of a person!</em></sub>
]







---
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
<h2>Library code</h2>
<h2>What are contract events?</h2>
]
.right-column[

### Event interface

> The main advantage of events is that they are stored in a special way on the blockchain so that it is very easy to search for them.

Basically events are ways of easily exposing data to external callers. The blockchain transaction log mechanism is used for this, which is why the behaviour is slightly quirky...

> Note the dichotomy that a contract can't access events and web3.js is needed, but web3.js can't access return values from a contract invocation. So a pattern of using both an event and a return value like this may be often needed where responding to an event both on and off-chain is desired:
>
>```
>event FooEvent(uint256 n);
>
>function foo() returns (uint256) {
>    FooEvent(1337);
>    return 1337;
>}
>```

]







---
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
<h2>Method visibility</h2>
<h2>Contracts calling contracts</h2>
<h2>Library code</h2>
<h2>What are contract events?</h2>
]
.right-column[
### Event interface (cot'd)

You can mark event parameters as `indexed`, which will display them as topics in the transaction log explorer and allow searching on them. This is important in the JavaScript layer of your Dapps, as filtering the event data from the chain transaction logs is the only way to listen for particular events. Perhaps easiest explained by example...

.caveat[A maximum of 3 event parameters can be marked as indexed]

.col2-left[
Contrived contract source:

```
contract MyBank {
    mapping(address, uint) balances;

    event TransactionMade(address indexed user, uint newBalance, uint timestamp);
    
    function makeTransaction(uint value) {
        balances[msg.sender] += value;

        // note that you don't really need the timestamp, since the presumption is that this happened 'right then'
        TransactionMade(msg.sender, balances[msg.sender], now);    
    }
}
```
]
.col2-right[
Dapp JavaScript:

```
var event = myContract.TransactionMade();
event.watch((err, result) => {
    console.log('Someone made a transaction:', result);
});

var meEvent = myContract.TransactionMade({ user: web3.eth.defaultAccount });
meEvent.watch((err, result) => {
    console.log('I made a transaction:', result);
});

// both above callbacks fire with `web3.eth.defaultAccount` and `23`
// `event.watch` will be fired if any other user makes a transaction as well
myContract.makeTransaction(23);
```
]
]

???
:TODO: above needs testing








---
name: code-best-practises
.left-column[
# Code best-practises
]
.right-column[

Enough nuts and bolts, how do we write these things?!
]

???
:TODO: dumb pic






---
name: iteration-vs-recursion
.left-column[
<h1>Code best-practises</h1>
## Iteration vs recursion
]
.right-column[

The EVM has an artificial stack depth limit of 1024 to prevent runaway contracts from executing recursion-based exploits. This safeguard is the only reason The DAO wasn't *completely* drained, so it's a good thing to have. Unfortunately it also essentially obviates recursion-based language design... unless a very interesting compiler is built!

Only external function calls have an impact on stack depth. Internal functions are implemented as `JUMP` instructions within the virtual CPU. Library function calls count towards stack depth, inherited functions don't. Keep these factors in mind when designing your contracts.
]





---
template: suggestion

- recurse like crazy when using internal function calls.
- avoid recursing when using external function calls, unless you have validated your code to work only under known scenarios where a necessarily shallow call-depth is expected.

???
:TODO: see if there are any limits on recursion for internal method calls






---
name: mapping-vs-array
.left-column[
<h1>Code best-practises</h1>
<h2>Iteration vs recursion</h2>
## Mapping vs. Array
]
.right-column[

http://ethereum.stackexchange.com/a/2597/2665

> mapping is generally recommended. For this use case of a contract, which could have an unlimited number of documents, which could be updated, the recommendation holds.

Remember that `mapping` can *only* be used for `storage` variables.

> The main advantage of an array is for iteration. But the iteration needs to be limited, not only for speed, but potentially for security. As an extreme example, a permanent Denial-of-Service could be inflicted on a contract if its service involves iterating over an array that an attacker can fill up, such that the cost of iteration and operation permanently exceeds the block gas limit.

Unless you need to iterate, you don't need an array (mappings are sparse).

> A comment by @PaulS suggests that iterating an array of length 50 is relatively efficient; testing the use cases is advised to also identify details such as desired or acceptable gas costs.

]







---
name: composition-or-inheritance
.left-column[
<h1>Code best-practises</h1>
<h2>Iteration vs recursion</h2>
<h2>Mapping vs. Array</h2>
## Composition or inheritance
]
.right-column[

http://ethereum.stackexchange.com/a/2222/2665

> Internal function calls are compiled as simple jumps inside the EVM. Thus only difference would be an extra JUMP operation for the function call balanced by perhaps shorter code overall.

Therefore, as a general rule functional composition is a pretty good way to go, and you can feel good about breaking your code up into smaller methods.

> Even if a contract inherits from multiple other contracts, only a single contract is created on the blockchain, the code from the base contracts is always copied into the final contract.

Contatenative inheritance means you won't save on chain storage costs by breaking your contracts up into smaller classes. In fact, probably quite the opposite due to the number of extra methods this architecture will likely introduce.

If you're concerned about bytecode storage size, use libraries to organise your shared code instead of base contracts. Ideally base contracts should be kept as lean as possible, since they'll be duplicated every time you deploy a new derived contract that extends from them.
]

???
:TODO: test bytecode size on different inheritance designs






---
name: delegates
.left-column[
<h1>Code best-practises</h1>
<h2>Iteration vs recursion</h2>
<h2>Mapping vs. Array</h2>
<h2>Composition or inheritance</h2>
## Delegates
]
.right-column[

`delegatecall` is the solution for structuring your pure library code: allowing you to put common code in places and run it without polluting method namespace of contracts you're creating. Note that you don't even have to use the method manually- when you use Libraries with Mix, the IDE will automatically link your contracts and allow you to write the call as if it were a normal contract within your project.
]






---
name: contract-design-patterns
.left-column[
<h1>Code best-practises</h1>
<h2>Iteration vs recursion</h2>
<h2>Mapping vs. Array</h2>
<h2>Composition or inheritance</h2>
<h2>Delegates</h2>
## Contract design patterns
]
.right-column[

Do you really want to make your contract self-destruct?

> If Ether is sent to removed contracts, the Ether will be forever lost.

<!-- :TODO: the docs say the contract will continue to be written to blocks if not removed, presume this is only for blocks that involve the contract but pays to check -->

https://ethereum.stackexchange.com/questions/1134/what-design-patterns-are-appropriate-for-data-structure-modification-within-ethe?newreg=c176baafe7254727b892b6c257938950

http://ethereum.stackexchange.com/questions/2159/guidelines-for-designing-contracts-to-handle-bugfixes/2162#2162

Redeploying at the same address is impossible.  
*(unless you can cause a hash collision hurrrr)*

> As for bugfixes, the common pattern is to have proxy or lookup contracts to be a gateway to the real one, which in case of a change or bugfix would be replaced. Replacing it also means losing the old storage contents.

]

???
:TODO: examples of classes needed







---
name: inline-assembly
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

???
:TODO: can you do this with LLL?!







---
name: some-real-stats-quicksort-vs-heapsort
# Some real stats: quicksort vs. heapsort

:TODO:






---
name: misc-gotchas
# Misc gotchas

- Always call local methods in aliased form, ie. call `f()`, not `this.f()`. The former is faster as it allows pass-by-reference- _once you call between contracts, data must be copied by value_.
- Never use `now` or `block.hash` as a source of randomness, unless you know what you are doing!
- `now` is the time of the last block, not *really* the exact current time.
- The constructor is removed from the contract code once it is deployed since it is only ever executed once. As such, it can't be called directly.






---
name: thedao-hack-what-went-wrong
.col2-left[
# TheDAO hack: what went wrong?

All discussion of *'The DAO'* refers to The DAO v1.0-  
https://github.com/slockit/DAO/tree/v1.0

Spot the bug:

```
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
```

]
.col2-right[

```
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
```

]






---
name: short-version
## Short version

- `splitDAO`(1) calls `withdrawRewardFor` calls `payOut`.
- `payOut` returns false if transferring the balance to the recipient of the split fails. I am reasonably sure this is good architecture- it allows `payOut` to be safely used on arrays of addresses to refund in bulk.
- However, `withdrawRewardFor` throws if `rewardAccount.payOut` fails! This can cause any operation `withdrawRewardFor` is involved in to fail.
- But, `splitDAO` is public...
- So the attacker can use a default function in their own contract (fired when `payOut` runs `_recipient.call.value(_amount)()`) to call `splitDAO` *while the original `splitDAO` call is still running*...
    - `splitDAO`(2) calls `withdrawRewardFor` calls `payOut`...
    - The original call (1) to `splitDAO` has still not run `balances[msg.sender] = 0;`... so `payOut` transfers the same balance back to the attacking contract as before...
    - This continues until the artificial EVM stack depth limit is reached (1024).
- The original `payOut` function will eventually get back a 'stack depth limit exceeded' exception from the original `_recipient.call.value(_amount)()` and return `false`.
- The original `withdrawRewardFor` function *throws* - and the balances are never reset! It's as if the attacker never withdrew from The DAO in the first place.

???
:TODO: yeah need more here, split this into stages with diagrams







---
name: guidelines-to-avoid-this-pitfall
## Guidelines to avoid this pitfall

- Ensure you update your contract's own internal state **before** interacting with any external addresses. 
- If these interactions fail, handle the effect in a way which **does not interfere** with any other address being processed.
- Presume any methods in your contract other than `internal` and `private` ones will be called by contracts other than those you expect.
- Also never presume that an address === a user. An address does not guarantee a real person.
- Use `send` instead of `call` wherever possible.
- Presume any call to an externally accessible contract method you define may run out of gas and fail.

???
:TODO: why are we recommending `send` instead of `call` now? Presumably to ensure only the default function is ever called, but I don't see how this is useful when one *does* need to `call`...

:TODO: some discussion of DAO framework v1 and test cases

:TODO: merge these in to above:
- The max call stack size is 1024. .caveat[Be sure to correctly handle the return value of `send`!]  
  http://hackingdistributed.com/2016/06/16/scanning-live-ethereum-contracts-for-bugs/  
  http://vessenes.com/ethereum-griefing-wallets-send-w-throw-considered-harmful/  
  http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/
- manage your internal contract's state BEFORE calling other contracts. If they fail it's then THEIR problem, not yours.
- ALWAYS specify a gas amount when calling other contracts (which prevents them being attackable by sending any amount of gas)






---
template: suggestion

- Learn to appreciate and understand the value of "functional programming" as well as "condition-oriented programming" ([https://medium.com/@gavofyork/condition-orientated-programming-969f6ba0161a](https://medium.com/@gavofyork/condition-orientated-programming-969f6ba0161a)).
- Use function modifiers to abstract conditions into annotations as much as possible.
- Write unit tests for everything.
- Minimise dependencies between contracts and functions as much as possible.






---
name: other-vulnerabilities
# Other 'vulnerabilities'

*"Solar Storm"* is not a real thing, really. This is just how you'd want programs to run, sometimes.

Let's all calm down for a minute...

- (19:01:52) pospi: depends how you want to look at it. programmer error, really is what I'd call it
- (19:02:25) pospi: (as in, Solidity programming errors with unexpected side-effects)
- (19:03:06) pospi: which is; not the fault of the Eth network / EVM / Blockchain any more than shitty Microsoft code running your kernel and fucking up your disk is your computer manufacturer's fault..
- (19:04:12) pospi: but the point still stands- should the network correct & account for these things at a protocol level, or are there cases where the functionality these bugs expose is in fact critical for the funcctioning of the whole platform?
- (19:04:25) pospi: and if that's the case- then you have a rather awkward catch-22 situation at a core system level
- (19:04:31) pospi: but! I dont really think it's going to be an issue, personally
- (19:04:56) pospi: people are pretty smart, and there's a lot of pretty smart people freaking out right now about ways to not have their money evaporate into thin air
- (19:05:47) pospi: so I think we can expect to see fixes for this kind of thing closer to the core in future (similar workarounds to the concept of "gas" itself), but for now people are just going to have to write better code to not get caught out by these kinds of attacks
- (19:06:09) pospi: and since theyre so well known now, then probably it's not going to be a thing bad actors can take advantage for long

???
:TODO: diagrams of the two vulnerabilities discussed

:TODO: flesh out to a take on current panic vs. reality of issue

:TODO: checkCaller method decorator thing to ensure caller is an instance of something else?

:TODO: Solar Storm image






---
name: towards-a-better-language
# Towards a better language?

    
http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/

- A purely functional language with a rich type system is needed. If we can't have that right now,
- All calls that send to untrusted address should have a gas limit
- Balances should be reduced before a send, not after one
- Events should probably have a Log prepended to their name.
- The splitDAO function should be mutexed and keep permanent track of the status of each possible splitter, not just through token tracking.


https://pdaian.com/blog/chasing-the-dao-attackers-wake/

> As a recommendation, do not call external contract code in your contract using Solidity’s call construct, ever if you can avoid it.  If you can’t, do it last and understand that you lose all guarantees as to the program flow of your contract at that point.

???
example @ http://vessenes.com/more-ethereum-attacks-race-to-empty-is-the-real-deal/

:TODO:
https://www.youtube.com/watch?v=3mgaDpuMSc0&feature=youtu.be&t=46m20s   (discussion on proof-based languages for smart contracts)






---
template: suggestion

Having written C, C++ and Java but also having written JavaScript using functional methodologies it's easy to see how Solidity *could* be leveraged to build rock-solid Dapps. It's also easy to see how you can shoot yourself in the foot with it. Some code smells we seem to be repeating here:

- *"Function modifiers"* in Solidity are basically like *"mixins"* in JavaScript. The only thing that differentiates them is the 
- OO-style inheritance and external library behaviour immediately makes reusing code efficiently cumbersome.
- Implicit state access between scope is always a bad idea. Always. PHP is the only language I've used that does this 'right'.
- Creating a paradigm where monolithic contracts are the norm for efficiency reasons is bad for code quality and logic isolation reasons. I don't know if this is happening or what the solution is, but that mindset should be avoided...

???
:TODO: finish slide.

Lib funcs allow `using` / `for` to avoid the mixin collision issue, but functions from parent classes don't appear to?








---
name: in-the-meantime
# In the meantime

For now, unit tests and better code analysis tools are important. If we can write error-free code in JavaScript using linters and test runners then we can do it here, too... let's just not forget: all software is terrible and **all risks are amplified**.

https://github.com/smartcontractproduction/sol-unit
- Simulates executing using the JavaScript VM https://github.com/ethereumjs/ethereumjs-vm
- Interface is a base `Test` contract providing assertion methods to be extended from, which should create instances of your testee contracts internally in order to run its tests.

https://github.com/androlo/sol-tester

???
:TODO: dapple test suite

https://github.com/nexusdev/dapple/blob/master/doc/test.md







---
name: contract-base-classes
# Contract base classes 

List to come...

???
:TODO: 

- `Destructible`  
  (fun `destroy`)
- & `Transferrable`  
  (fun `transferOwnership`)
    - is `Ownable`  
      (prop `address owner`)  
      (mod `OwnerOnly`)
- `Splittable`  
  (fun `split`)  
  *(no doubt will need some interfaces here)*
    - is `MajorityOwnable`  
      (prop `mapping(address => uint) owners`)  
      *(don't like this - would necessitate new class for every data size)*
      (fun `purchaseOwnership`)  
      (fun `withdrawOwnership`)  
      (ifce `calcPurchaseAmount`)  
      (ifce `calcWithdrawAmount`)  
      (ifce `calcVotingInput`)
- really don't want to have to do `MajoritySplittable` etc, am I doing it wrong?
- thinking conventions... 'owner'/'purchase'/'calc' for things involving $!
- registrar: see `dapp-bin/registry`
- helpers for managing common default function & suicide behaviours



---
name: function-libraries
# Function libraries

- `CallProxy` (helper)  
  (fun `setCallTarget(account)`)  
  *(however methods are proxied?)*
- `AccountList` (datatype)  
  (fun `indexOf(account)`)

???
:TODO: 

- find a well unit-tested storage framework (or make one)
- ADTs for efficient storage
- audit this stuff again, get more specific links

- https://github.com/Arachnid/ens - Ethereum Name Service
- https://github.com/Arachnid/solidity-stringutils
- https://github.com/axic/density
- https://github.com/axic/etherboard
- https://github.com/chriseth/solidity-examples
- https://github.com/dadaista/bitshelter
- https://github.com/emailgregn/contracts
- https://github.com/FrankHold/DApp_SyntheticTrader
- https://github.com/JeffreyBPetersen/contract-testing
- https://github.com/JeffreyBPetersen/data-sharing-contracts
- https://github.com/nexusdev/dappsys
- https://github.com/nickfranklinuk/canary
- https://github.com/phillyfan1138/DArtist
- https://github.com/smartcontractproduction/dao
- https://github.com/zmitton/ethereum_escrow

<sub>*<em>Please note: you can grab all these by running `./get-example-libs.sh` after cloning this repository.</em></sub>





---
name: final-observations
template: callout
# Final observations:

- The risks are high with any on-chain language- no software stack to act as padding for bugs.
- Solidity is a means of direct manipulation of the blockchain database state.
    - State is evil! Uh-oh...
        - Recursive calling vulnerabilities happen due to errors in *ordering state manipulations*
        - Better code analysis tools are needed
        - Linters and unit tests need to be the norm, at minimum
        - Better languages are needed: OCaml or Haskell-like, code as provable theorems
- All external function calls are untrusted and could come in from anywhere.
- There are **absolutely no guarantees** as to another contract's state or behaviour unless cryptographically provable to be authored from a given source code.






---
template: start
count: false
# Thanks!

???
:TODO: Yep need more dumb pics fo sho
