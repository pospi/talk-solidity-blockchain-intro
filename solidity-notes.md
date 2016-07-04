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
        <li><i class="icon-link"></i> pospi.spadgos.com</li>
        <li><i class="icon-github"></i> github.com/pospi</li>
        <li><i class="icon-mail"></i> pospi@spadgos.com</li>
        <li><i class="icon-twitter"></i> twitter.com/pospigos</li>
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
        <li><i class="icon-link"></i> pospi.spadgos.com</li>
        <li><i class="icon-mail"></i> pospi@spadgos.com</li>
        <li><i class="icon-github"></i> github.com/pospi</li>
        <li><i class="icon-twitter"></i> twitter.com/pospigos</li>
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
name: default
template: base
layout: true

---
template: start





<!-- Begin presentation -->

<h1>Solidity &amp; Systems Programming on the Blockchain</h1>

<h3>A knowledge remix</h3>

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
        - [No I/O necessary](#no-io-necessary)
    - [Arrays](#arrays)
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
    - [Inline assembly](#inline-assembly)
- [Contracts calling contracts](#contracts-calling-contracts)
    - [Method visibility](#method-visibility)
    - [Internal and external interfaces](#internal-and-external-interfaces)
    - [Reference types and contract interfaces](#reference-types-and-contract-interfaces)
    - [Contract fallback functions](#contract-fallback-functions)
    - [Contracts as addresses](#contracts-as-addresses)
    - [Contracts creating contracts](#contracts-creating-contracts)
    - [Library code](#library-code)
        - [Libraries as datatypes](#libraries-as-datatypes)
- [What are contract events?](#what-are-contract-events)
    - [Event interface](#event-interface)
- [Code best-practises](#code-best-practises)
    - [Iteration vs recursion](#iteration-vs-recursion)
    - [Mapping vs. Array](#mapping-vs-array)
    - [Composition or inheritance](#composition-or-inheritance)
    - [Delegates](#delegates)
    - [Contract design patterns](#contract-design-patterns)
- [Some real stats](#some-real-stats)
- [Misc gotchas](#misc-gotchas)
- [TheDAO hack: what went wrong?](#thedao-hack-what-went-wrong)
    - [Short version](#short-version)
    - [Guidelines to avoid this pitfall](#guidelines-to-avoid-this-pitfall)
- [Other 'vulnerabilities'](#other-vulnerabilities)
- [Towards a better language?](#towards-a-better-language)
- [In the meantime](#in-the-meantime)
    - [Unit testing frameworks](#unit-testing-frameworks)
    - [Contract base classes](#contract-base-classes)
    - [Function libraries](#function-libraries)
- [Final observations](#final-observations)

<!-- /MarkdownTOC -->
]







---
count: false
<h1>Conventions used in these slides</h1>

From time to time, I've used some labels to try to highlight things that are important to note:

- .caveat[Caveats] - gotchas in the language that you should be sure to remember.
- .suggestion[Suggestions] - my own opinionated suggestions, based on my current research and 12 years as a software engineer.  
  <sub>(whatever you think that's worth :p)</sub>

I found good tutorial material for Solidity was rather scarce, so I may as well keep these notes up to date somewhere (at least for Solidity 1.0). 

- .update[Updates] - anything new added after presenting this for the reals. Feel free to submit pull requests at  
  https://github.com/pospi/talk-solidity-blockchain-intro.
- .correction[Corrections] - if and when I find anything in this presentation to be incorrect I'll be updating it with the latest information. This is just me planning a special just-in-case label :p

???
:TODO: color convention







---
name: same-concepts-different-environment
# Same concepts, different environment

Solidity should be thought of as a *systems programming language*. Though syntactically similar to JavaScript, it is much more like C++ in terms of its structure and ways of handling data & memory.

**Ethereum is a low-level system**. Think of it like programming for an Arduino board, Onion Omega or Raspberry Pi. Resources are extremely scarce.

- Ethereum blockchain ~= RAM ~= Hard Drive
- Ethereum Virtual Machine (EVM) ~= Java Virtual Machine (JVM) ~= x86 CPU
- Contract bytecode ~= Java Bytecode ~= x86 bytecode
- Solidity ~= C++ ~= Java
- Solidity compilers (`solc`) ~= `gcc` ~= `gcc-c++` ~= `javac`
- Contracts ~= Classes
- Deployed contracts ~= Objects
- Deployed contract address ~= memory address ~= file inode

Note that RAM & hard disk are combined since Ethereum's execution *as a program* and its blockchain storage *as state* are fused into the same thing. As we'll soon see, "reading a file" is no longer a task we need be concerned with.

???

:TODO: Needs chain / EVM / Solidity picture <!--pic01-->






---
name: solidity-is-not-the-end-all
# Solidity is not the end-all

Serpent and LLL can also be written, and likely more efficiently (LLL in particular). Try them all out in-browser!

- https://ethereum.github.io/browser-solidity/ - Solidity scripting
- http://etherscripter.com - visual code editor, Serpent and LLL scripting

All compile to EVM bytecode. Solidity was not the first EVM-compiled language, and it will not be the last.

...and it may not be the best tool for the job&mdash; see *"The Great DAO Hack"*! We'll come back to this later...


???

:TODO: picture with other languages in it <!--pic02-->






---
name: words-of-caution
# Words of caution

I'll try not to pick on JavaScript developers too much (I'm one of them!); but&mdash;

> Do not develop Solidity contracts without a reasonable grasp of the underlying Ethereum Virtual Machine execution model, particularly around gas costs.
>
> <cite>http://www.kingoftheether.com/postmortem.html</cite>

Statements like this should give us *all* pause for thought here. But please, don't let this dissuade you from experimenting! The only way to learn is to tinker and reflect&mdash; that's what the testnet and the community are for.

```js
function learnSmartContractDevWhenReady(dev, startLearningSolidity) {
    const languagesLearned = dev.getLanguagesLearned();

    if (['JavaScript', 'C', 'C++', 'C#', 'Java', 'Go', 'Rust', 'OCaml', 'Ada', 'Pascal']
      .filter(lang => languagesLearned.includes(lang)).length >= 2) {
        return startLearningSolidity(dev);
    }

    setTimeout(() => {
        learnSmartContractDevWhenReady(dev, startLearningSolidity);
    }, 1000 * 60 * 60 * 24 * 30);
}
```




---
count: false
<h1>Srysly tho</h1>

In terms of this simple JavaScript snippet:

```js
var a = new Array(100);
a.push(12);
```

What is the in-memory length of the array `a` after the script runs?

???

wait for iiiit...



--
count: false

If you didn't answer `200`, and looking up the explanation as to *why* surprised you or was difficult to understand in any way, then Solidity is not yet for you! (;






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

Like .superstress[really important]. Pre-increment vs. post-increment, *'for'* vs *'foreach'*, references vs. copies: all those arguments we gave up on years ago are back and more relevant than ever. Why?

.superstress[Clock cycles cost ether and make slow code more expensive to run.]

&nbsp; *Why would I use your code if it costs me more?*

.superstress[Inefficient storage causes blockchain bloat and makes it less practical for everyone to sync.]

&nbsp; *Why would I use Ethereum if I need a 20TB hard drive to run a full node?*  
&nbsp; *Why would I buy in to a network that big mining pools have a monopoly on?* etc

.superstress[Computation costs electricity and creates hundreds of millions of tonnes of CO<sub>2</sub> every year.\*]

&nbsp; *Why would we all keep running a network that's killing the planet?*  

<br /><br /><br /><br />*<sub><em>No, really... look it up. Start here: http://www.coindesk.com/microscope-economic-environmental-costs-bitcoin-mining/</em></sub>

???

Worth stressing that environmental impact is something that not many people are discussing or even openly acknowledging, and that needs to change.

Also that in no way do any future optimisations or improvements make this less true. When you get down to the basic physics of things, burning energy is burning energy; and we don't have enough of it for everyone right now.

Eth 2.0 / proof of stake, Peercoin, Litecoin & even Ripple (despite its political shortcomings) are great examples of where things should be moving.







---
name: quantifying-efficiency
# Quantifying 'efficiency'

Three metrics: gas cost (in `wei`), reserved storage size (in `bytes`) & bytecode size (also measurable in `bytes`). Note that contract storage is statically allocated *once* at the time you deploy a contract and its size never changes thereafter, so some interfaces may give you back a single value for *'contract size'* at the time of compilation.


--
count: false

***Relative importance: gas cost > storage size > bytecode size.***

In general, you will want to prioritise architectural decisions in this order. Note that performance (in terms of speed) should **not** be a concern to you. *"CPU-intensive"* in this environment means on the order of sorting an array of more than 50 elements&mdash; not much horsepower at all!

- .suggestion[Prioritise the gas cost of interacting with your contracts above all else.] Some statisticians have claimed that a single bitcoin transaction causes as much CO<sub>2</sub> pollution as keeping a car on the road for *3 days*. Remember that all computation costs energy and that your effects here are amplified drastically by the size of the network.
- Storage and bytecode size are equivalent priorities, but storage is more under your control:
    - Be dilligent about utilising contract storage variables fully and allocating as little space as possible for dynamic arrays. 
    - Learn to understand how the Solidity compiler handles your code and build up a library of optimal libraries and algorithms for common tasks. Use Mix or your test framework to compare bytecode sizes for contract generation.





---
name: a-blockchain-is-not-always-the-answer
# A blockchain is not always the answer
 
CPU-intensive operations like sorting large arrays should be placed off-chain and run by a trusted party. Note also that the results of such computations are easily auditable by running parallel off-chain proofing servers to verify the primary server's on-chain output/input, and can be easily managed via `Owned` contract base classes and `ownerOnly` function modifiers (to be examined later).

.center[<img height="360" src="res/randart/everybodygetsablockchain.jpg" />]







---
name: types
.left-column[
# Types
]
.right-column[

.fr[
<img height="500" src="https://imgs.xkcd.com/comics/types.png" />
]

Solidity has the usual memory-centric datatypes we're used to seeing in low-level languages, with some modern conveniences baked in to the compiler.

In other words, it doesn't make the same tradeoffs JavaScript does in terms of providing a dynamic high-level abstraction over the raw data the CPU is crunching. I don't even know why it was billed as a *'JavaScript-like language'*. It's an Algol-derived language like basically every other language that has lots of `{`'s and `(`'s in it. If anything it's *'C-like'*!
]






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
    - assignment must be done with bitwise operators currently
    - has a `length` attribute
- No floats, but fixed-point math is built in to the syntax
    - see `ufixed8x248`, `ufixed128x128` and similar types- 
    - FPU "coming soon". I wouldn't be surprised if this does not come until Ethereum 2.0 (proof of stake). If a Nintendo DS is too low-powered for one, then the EVM *definitely* is.
- enums (c-like, stored as smallest possible `int` type)
    - When passed over the ABI, will be coerced: given `enum ActionState { Started, Stopped }`, `StartAction == 0` etc
- time units and ether units can all be entered literally for convenience and are interpreted as the base type (`wei` and `second`). `2 ether == 2000 finney`, `1 minutes == 60 seconds` etc. Note that all arithmetic uses ideal time and does not account for timezones, leap seconds or otherwise. See http://ether.fund/tool/converter for converting ether units.  
  .suggestion[Always specify these units when performing time calculations or value transactions for clarity.]
]





---
name: constants
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
### Constants
]
.right-column[

An important optimisation is to use the `constant` modifier when declaring contract variables that don't change. The compiler will substitute the raw value for the variable and skip reserving `storage` for it. You can use basic integer arithmetic in these assignments.

```
contract C {
    uint constant x = 32**22 + 8;
    string constant text = "abc";
}
```

.caveat[There is also a `constant` keyword for defining functions as immutable, but it is not yet enforced.]

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

All reference types are accessed via variables on your deployed contract. There is no OO-like `static` in the sense of shared memory space on the class that is accessible by all instances of an object. To achieve such an outcome, one would need to deploy a separate shared storage contract to the blockchain and reference its address onto each of your own compiled contracts.

Solidity's reference types take on an additional attribute in their *"context"*- defined as either `storage` or `memory`. This language keyword is all that is needed to differentiate between persistent data stored on-chain and transient data used during intermediate computations.
]

???
:TODO: <!--picRT--> needs storage/ref types pic







---
name: data-location
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
]
.right-column[

### Data location

For reference types, we have to think about whether the data they reference is only kept in `memory` while the EVM is running this execution cycle, or if they should persist to `storage`.

> The default for function parameters (including return parameters) is `memory`, the default for local variables is `storage` and the location is forced to `storage` for state variables (obviously).
>
> <cite>http://solidity.readthedocs.io/en/latest/types.html#data-location</cite>

If you continue to think of contracts the same as classes, then these semantics should follow:

- Contracts ~= Classes
- Deployed contracts ~= Objects
- Contract functions ~= Object methods
- State (`storage`) variables ~= Instance variables
]

???
:TODO: 
- work out what up with the above comment cos surely not every locally assigned variable in a function persists






---
name: handling-data-location
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
]
.right-column[

### Handling Data location

- Simply declare variables as `storage` or `memory` depending on whether you want them to be persisted to the blockchain. **No I/O necessary**- just assign data and you're done!
- Add the same keywords to function arguments in order to control the data's *context* when passed in.
- .caveat[You must declare `storage` in your function signatures if you want to operate on storage data without it being copied into memory first]  (which is an expensive operation &mdash; but note that it may still be less expensive than mutating a `storage` variable multiple times).

#### Cleaning up

Deleting state variables can be done with the `delete` operator. .caveat[Contract storage is statically assigned at the time of contract creation]&mdash; there is really no such thing as "delete". What the operator really does is set the value to the initial value for the type, ie. `x = 0` for integers. Because of this, some weird caveats apply when attempting to delete references to already deleted storage variables.

.suggestion[always address the full path to data you wish to delete.]
]






---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
]
.right-column[
<h3>Reference behaviour</h3>

You can declare local variables within functions which reference storage variables. Modifying data via references will modify the persistent storage data the reference is bound to. Conceptually this is the same as a JavaScript or C reference- a new pointer was created to store a reference to another piece of (`storage`) memory that was already present. **Variables are just dumb pointers and don't care whether the address they reference is in `memory` or `storage`.**

Note the important distinction or possible .caveat[`storage` is pass-by-value and `memory` is pass-by-reference.] Of course there is a reason for this- on the one hand you are manipulating data in a database directly and on the other you are manipulating variables as they flow through memory... even if the interface presented is seamless.

For more information, see http://solidity.readthedocs.io/en/latest/types.html#data-location
]






---
name: no-i-o-necessary
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
]
.right-column[
### No I/O necessary

Let's take a moment here to think about what's involved in a modern web application. Between you clicking a button on some website and the relevant piece of data changing on the other end there are *countless* layers of checks and balances in place before that information gets to the database. Along with those comes a certain amount of 'padding'.

On the blockchain, there is no such padding. You could probably say Solidity is more of a *database* language than it is a systems one&mdash; and if you know any database admins then you know they are very protective of their data! They have good reason to be&mdash; a modern organisation's data is its livelihood and when it is lost the business usually follows.

]

???

:TODO: example code and/or <!--picIO-->







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

#### Byte arrays

- variable byte arrays: `bytes`
- strings (character arrays): `string` (like `bytes`, but respects encoding rules)
    - note string literals will be encoded as `bytes` where possible

#### Reference arrays

- fixed-length: 
    - Type[Size] eg. `byte[4]`
- dynamic-length:
    - Size is optional, when ommitted the array length is dynamic- `int8[]`
    - `bytes` acts identically to `uint8[]` or `byte[]`, but is stored without padding and thus packed more tightly in function call data. Use it, it's cheaper!
]

???
:TODO: can bytes be longer than 32?






---
name: using-arrays
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
name: array-caveats
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
]
.right-column[

### Array caveats

You can't make `storage` arrays all that large in practise:

> Note that filling a 10x10 square of `uint8` + contract creation took more than 800,000 gas at the time of this writing. 17x17 took 2,000,000 gas. With the limit at 3.14 million... well, there’s a pretty low ceiling for what you can create right now.
>
> Note that merely “creating” the array is free, the costs are in filling it.
>
> <cite>http://solidity.readthedocs.io/en/latest/frequently-asked-questions.html</cite>

.caveat[A dynamic array will create a separate storage slot for every element.] This is usually a waste of space unless every element has 256 bits of data in it&mdash; use fixed-width arrays wherever possible.

.suggestion[Use larger types and bitwise math to pack smaller values in arrays to conserve storage slots.]

]

???
:TODO: check these array storage padding things






---
.left-column[
<h1>Types</h1>
<h2>Value types</h2>
<h3>Constants</h3>
<h2>Reference types</h2>
<h2>Arrays</h2>
]
.right-column[

<h3>Array caveats (cot'd)</h3>

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

.col2-left[
#### mappings:

Are defined with type syntax eg. 

```
mapping (uint => address) myAddressList;
```

Like a JavaScipt `HashMap`, allows pretty much any value other than another mapping as keys.

.caveat[Mappings are only allowed for `storage` variables]  (or as `storage` reference types in internal functions).

]
.col2-right[

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
name: address-methods
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
    - The contract's *fallback function* is called *(more on this later)*.
- `call` & `delegatecall`
    - For calling other contracts which you don't yourself own or interacting with library contracts (to be discussed soon!)
    - Note that `send(number)` is equivalent to `call.gas(0).value(number)()`. This makes `send` a safer option than `call`, since it ensures the address being called can't run any EVM code of its own&mdash; important when you don't know whether the recipient is a person or a contract! 
- `callcode` is just `call` without the `msg` object, don't bother with it
- none of these `address` methods allow you to access the return value
- all return a boolean indicating whether the invoked function terminated (`true`) or caused an EVM exception (`false`)
]

???
:TODO: should ensure that addresses behave the same for contracts and humans







---
name: address-magic
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

Another convenience is the `value` and `gas` methods of all external function references. These can be used to set the values sent with external function calls / transactions:

```
contract InfoFeed {
    function info() returns (uint ret) { return 42; }
}

contract Consumer {
    InfoFeed feed;
    function setFeed(address addr) { feed = InfoFeed(addr); }
    function callFeed() { feed.info.value(1 ether).gas(800 wei)(); }
}
```

Note the chained method calls only set the values, and it's not until the final set of braces are executed that the external method runs. This is conceptually similar to using `.bind()` or function currying in JavaScript.
]







---
name: control-flow--syntax
.left-column[
# Control flow & syntax
]
.right-column[
<h3>Basic constructs</h3>

All the standard C stuff: `if`, `else`, `for`, `while`, `break`, `continue` and `return`. No `switch`, by design (not as performant as if/else conditions).

.caveat[No type coercion from `int` -> `bool`, you need to do this explicitly in conditionals.]

Return types are specified in the function signature:

```
function func(uint k, uint) returns(uint) { 
    return 3;
}
```

]






---
.left-column[
<h1>Control flow & syntax</h1>
]
.right-column[
<h3>Convenience features</h3>

Tuple structures are not first-class types yet, but they can be used in a limited form to return and assign multiple values, denoted by parentheses:
  
```
function f() returns(uint, bool, uint) {
    return (7, true, 2);
}

function g() returns(uint, bool, uint) {
    var (a, b, c) = f();               // argument unpacking
    (a, b, ) = (1, false, "ignored");  // also fine
    var error = (1, 2);                // not at all fine
    return (7, true, 2);
}
```

Named arguments (a bit Rust-like) are possible:

```
function f(uint key, uint value) { /* ... */ }

function g() {
    f({ value: 2, key: 3 });
}
```

]





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

**Perhaps one of the most important aspects of Solidity.** These are functions defined with a special `modifier` keyword within your contracts. The names given can be applied to functions in order to execute the modifier before the function runs. You can `throw` or `return` from these modifiers to prevent the function from being called or short-circuit its execution (respectively).

```
modifier onlyOwner {
    if (msg.sender != owner)
        throw;
    _   // the underscore will be replaced with the invoked function by the compiler
}
    
function destroy() external onlyOwner { 
    suicide(msg.sender);
}
```

Modifiers can accept arguments, which are referenced from contract state variables. They are inheritable and overridable like normal methods. Multiple modifiers are evaluated left to right. The built-in visibility modifiers don't have to come before your custom ones, but they should- it's in the official style guide.
]






---
In this example we've decoupled the check (`onlyBy`) from the context of "`owner`" without creating any extra logic paths, and can now re-use it for different access checks:
<br clear="all" />

.col2-left[
```
contract accessModifiers {
    modifier onlyBy(address _account) {
        if (msg.sender != _account)
            throw;
        _
    }
}
```
]
.col2-right[
```
contract Owned is accessModifiers {
    address owner;

    modifier onlyOwner() onlyBy(owner) { _ }

    function Owned() {
        owner = msg.sender;
    }

    function destroy() onlyOwner {
        suicide(msg.sender);
    }
}
```
]

<br clear="all" />
This is very similar to how decorators function in Python and JavaScript ES7 or how annotations function in Java. **It allows us to functionally compose conditions without introducing bugs.**

.suggestion[Write base modifiers as pure functions which do not depend on any external state, and use functional composition to create specifics.] This helps to keep modifiers generic and reusable.

Further reading: [https://medium.com/@gavofyork/condition-orientated-programming-969f6ba0161a](https://medium.com/@gavofyork/condition-orientated-programming-969f6ba0161a)






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






---
name: inline-assembly
.left-column[
<h1>Control flow & syntax</h1>
<h2>Interpreter caveats</h2>
<h2>Function modifiers</h2>
<h2>Contract structure</h2>
## Inline assembly
]
.right-column[

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

]

???
:TODO: can you do this with LLL?!






---
name: contracts-calling-contracts
.left-column[
# Contracts calling contracts
]
.right-column[

Remember this guy?

> Do not develop Solidity contracts without a reasonable grasp of the underlying Ethereum Virtual Machine execution model, particularly around gas costs.

We're about to see why this stuff is so scary.
]

???
:TODO: random img






---
name: method-visibility
.left-column[
<h1>Contracts calling contracts</h1>
## Method visibility
]
.right-column[

On top of the usual concepts of method visibility you'd be familiar with from C++, there is an extra distinction: *"external"* vs *"internal"*. **All method calls in Solidity are either "external" or "internal" at runtime.** The available method access specifiers are as follows:

- `external`: This method can be called externally by other contracts, and even its own methods *must* call it in that way.
- `public`: Callable from external contracts, as well as internally *(default)*. The context of the method call will be that of the method that calls it, as you'd expect.
- `internal`: Similar to *"protected"* in C++ and obviously only internally callable since you need to define a subclass in order to inherit.
- `private`: Only callable by this contract, and only internally.

Note that these are only access specifiers enforced by the EVM and in no way hide information contained within your contracts&mdash; they merely control how it can be manipulated.  
**Everything is public on the blockchain** <sub>*<em>(discounting things like zero-knowledge proofs)</em></sub>
]








---
name: internal-and-external-interfaces
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
## Internal and external interfaces
]
.right-column[

As mentioned, the EVM has many languages which compile down to its CPU bytecode. As such, there is a lower-level API available between contracts with a more restricted set of datatypes (known as the *Contract ABI* or *"Application Binary Interface"*) which must be used when calling between them (Serpent doesn't know about the types of data structures Solidity supports, for example). This also applies even when calling a contract's own methods via the `this` pointer.

.caveat[Method access operates very differently depending on the calling context.]

- Internal function calls are extremely cheap and implemented as `JUMP` inside the EVM, so no memory is cleared. They also don't contribute to stack depth.
- External function calls (`send`, `call`, calling via `this` and calling library methods) happen across the boundaries between contracts. .caveat[There is an artificial limit of 1024 on stack depth for external function calls.]
- Since external function calls happen at the ABI level, they can only handle fundamental data types. Any complex data you wish to pass between functions must include encoding / decoding logic. .caveat[Data passed through all external method calls is copied by value.]

]

???
:TODO: picture needed <!--picABI-->

:TODO: work out what the caveats are






---
name: reference-types-and-contract-interfaces
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
## Reference types and contract interfaces
]
.right-column[

Solidity's more complex datatypes can't be passed through external contract function calls. This is the difference between the *Application Binary Interface* and *Solidity*'s language interface- the former is at a CPU level and can only understand basic memory types, the latter is at a language level and can understand the more complex structures and conveniences Solidity provides over the raw assembly instructions and type interpretations.

- Internal contract methods and methods of superclasses: All Solidity datatypes allowed, accessed directly
- Other contract methods: Only ABI datatypes allowed, accessed via `call` and `delegatecall`

*However*- watch this space. I strongly suspect that if one has access to the source code of a contract then it could be applied over an address where said contract has been uploaded as a typecast in future (ie. `KnownContract(0x123ABetc)`), as is done automatically by Mix with contracts within your project.
]

???
:TODO: 
well, this seems to contradict that assumption (from docs):

> If a contract wants to create another contract, the source code (and the binary) of the created contract has to be known to the creator. This means that cyclic creation dependencies are impossible.

might be able to test this in Mix- see if source can be associated with an address manually on the testnet after clearing Mix settings

:TODO: string ABI passing example






---
name: contract-fallback-functions
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
## Contract fallback functions
]
.right-column[

Earlier we discussed the `address` methods `send` and `call`. Fallback functions are what happens when you fire these methods. Fallback functions are always `public`.

They are declared as functions with no name declared within the contract, and handle the condition when someone sends ether to the contract but doesn't do anything else. Since this is generally the result of user error, you should most often *(**but not always**)* provide this function as below if you don't want your contract storing money:

```
contract nonReceiver {
    function() {
        throw;
    }
}
```

This will cause any funds sent in the transaction to be returned and the transaction to be politely rolled back until handled by the caller.
]

???

:TODO: check that fallbacks are always public






---
name: contracts-as-addresses
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
## Contracts as addresses
]
.right-column[

If you want to think about this in JavaScript terms, you can think of `address` as being part of the prototype chain of every `contract`. In classical OO&mdash; a superclass is pretty accurate.

`address` has an implicit fallback function that looks like this: `function() {}`. In other words- take the money and do nothing. When you call `send` or `call` against another contract, this is why you lose your money unless the recipient is a real person or a contract that handles the fallback condition.

When we know what's contained within a contract, we can typecast the address to the known signature of our contract bytecode, and interact with it using our own API:

```
:TODO:
```

]

???
:TODO: need to find out how to get return values out of calling other contracts' methods (internal and external ones)







---
name: contracts-creating-contracts
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
## Contracts creating contracts
]
.right-column[

Note the brackets needed in order to provide a particular value to the constructor call.

```
contract B {}


contract A {
    address child;

    function test() {
        child = (new B).value(10)(); // construct a new B with 10 wei
    }
}
```

]
???
:TODO: finish





---
name: library-code
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
<h2>Contracts creating contracts</h2>
## Library code
]
.right-column[

A code library in Ethereum is just a contract declared with the `library` keyword instead of `contract`. Libraries can have no `storage` of their own and are always compiled to `delegatecall` by the compiler.

> If you use libraries, take care that an actual external function call is performed.  
> [...]  
> Calls to library functions look just like calls to functions of explicit base contracts (`L.f()` if `L` is the name of the library).
>
> <cite>http://solidity.readthedocs.io/en/latest/contracts.html#libraries</cite>

.caveat[When deploying, the library will actually be deployed to a separate contract on the blockchain.] The usual external function `delegatecall` rules apply.

It's important to note the importance of the `storage` keyword in function parameters for libraries. Without this keyword, functions will create a deep copy of any arguments passed in, which is not only expensive in memory consumption but also means that modifying storage directly via library methods would not be possible- which is where the power of `delegatecall` comes from.

]

???
:TODO: can you pass memory values in as `storage` args?

:TODO: this is interesting cos it means you pretty well *can* just apply a c'tor over an address and interface with it. Is interfacing with other contracts via `delegatecall` any different?

If this turns out to be the case then *All external function call rules apply.* no longer applies!






---
name: libraries-as-datatypes
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
<h2>Contracts creating contracts</h2>
<h2>Library code</h2>
### Libraries as datatypes
]
.right-column[

One useful application of libraries is as extensions to the core datatypes available in the language. For example (taken from the docs), given the library:

```
library Set {
    struct Data { mapping(uint => bool) flags; }

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







---
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
<h2>Contracts creating contracts</h2>
<h2>Library code</h2>
<h3>Libraries as datatypes</h3>
]
.right-column[

We can import the `Set` type and use its members in derived classes...

    import { Set } from "Set";

    contract C {
        Set.Data knownValues;

        function register(uint value) {
            // The library functions can be called without a
            // specific instance of the library, since the
            // "instance" will be the current contract.
            if (!Set.insert(knownValues, value))
                throw;
        }
        // In this contract, we can also directly access knownValues.flags, if we want.
    }
    
]







---
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
<h2>Contracts creating contracts</h2>
<h2>Library code</h2>
<h3>Libraries as datatypes</h3>
]
.right-column[

...but we can also import the library's contents directly onto the data structure using, err... `using` syntax:

    import { Set } from "Set";

    contract C {
        using Set for Set.Data;
        Set.Data knownValues;

        function register(uint value) {
            // Here, all variables of type Set.Data have
            // corresponding member functions.
            // The following function call is identical to
            // Set.insert(knownValues, value)
            if (!knownValues.insert(value))
                throw;
        }
    }

This is a strange-looking control inversion whereby we copy all the library functions onto the destination type; and the context will be passed as the first parameter. It's basically equivalent to currying all the member functions of library `Set` with the type `Set.Data` as the first parameter.

You'll notice I highlighted `self` as a keyword in the earlier library methods&mdash; this seems like a good convention to enforce when using libraries in this manner.

]







---
.left-column[
<h1>Contracts calling contracts</h1>
<h2>Method visibility</h2>
<h2>Int'l & ext'l interfaces</h2>
<h2>Reference types & i'faces</h2>
<h2>Contract fallback functions</h2>
<h2>Contracts as addresses</h2>
<h2>Contracts creating contracts</h2>
<h2>Library code</h2>
<h3>Libraries as datatypes</h3>
]
.right-column[

We can do this now within a contract in order to augment base types...

    import { Set } from "Set";

    contract  C {
        using Set for uint[];
        uint[] knownValues;

        function register(uint value) {
            // The following function call is STILL identical to
            // Set.insert(knownValues, value)
            if (!knownValues.insert(value))
                throw;
        }
    }

Note that in future the `using` declaration may well be lifted to global scope in order to allow project-wide dynamic extension of the built-in types.

...none of this sounds like an especially good idea to me - didn't we learn our lesson with extending built-in JavaScript prototypes? **If, however** the plan is to enable long-term extension of the language in the same way as modern JavaScript features like `Promise` can be polyfilled in older environments&mdash; well then there are interesting times ahead.

]





---
name: what-are-contract-events
.left-column[
# What are contract events?
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
name: event-interface
.left-column[
<h1>What are contract events?</h1>
## Event interface
]
.right-column[

> The main advantage of events is that they are stored in a special way on the blockchain so that it is very easy to search for them.
>
> <cite>http://solidity.readthedocs.io/en/latest/frequently-asked-questions.html</cite>

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

Events can also be `anonymous`, which prevents the event signature being stored as a topic in the transaction log. It will still be there though.

]







---
.left-column[
<h1>What are contract events?</h1>
<h2>Event interface</h2>
]
.right-column[

You can mark event parameters as `indexed`, which will display them as topics in the transaction log explorer and allow searching on them. This is important in the JavaScript layer of your Dapps, as filtering the event data from the chain transaction logs is the only way to listen for particular events. Perhaps easiest explained by example...

.caveat[A maximum of 3 event parameters can be marked as indexed]

.col2-left[
Contrived contract source:

```
contract MyBank {
    mapping(address, uint) balances;

    event TransactionMade(
        address indexed user, 
        uint newBalance, 
        uint timestamp
    );
    
    function makeTransaction(uint value) {
        balances[msg.sender] += value;

        TransactionMade(
            msg.sender, 
            balances[msg.sender], 
            // kinda redundant since we know `block.timestamp`
            now
        );    
    }
}
```
]
.col2-right[
Dapp JavaScript:

```js
myContract.TransactionMade().watch((err, result) => {
    console.log(
        'Someone made a transaction:', 
        result
    );
});
myContract.TransactionMade({ 
    user: web3.eth.defaultAccount 
}).watch((err, result) => {
    console.log(
        'I made a transaction:', 
        result
    );
});
myContract.makeTransaction(23);
```

Both events fire when current user makes a transaction.
Only #1 fires if another user does it.

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

Enough nuts and bolts, how should we write these things?!
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

.suggestion[Recurse like crazy when using internal function calls.]  
.suggestion[Avoid recursing when using external function calls], unless you have validated your code to work only under known scenarios where a necessarily shallow call-depth is expected.
]

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

.suggestion[Create many small, abstract base contracts for use in your projects.] Keep them decoupled from each other. Keep your inheritance graphs shallow, and broad&mdash; think of base contracts like *"mixins"* in JavaScript or *"traits"* in PHP. Use a combination of contract inheritance and function modifiers to compose more complex contracts from your base pallette.

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

:TODO: investigate function pointers further.. this is a thing for toggling behaviour!

:TODO: investigate ways of migrating contract state.. `exportable` base contract?







---
name: some-real-stats
# Some real stats

:TODO: actually this should be a slide which references all the test contracts I've been fiddling with, presuming I get time to fiddle with them






---
name: misc-gotchas
# Misc gotchas

You can consider all of these a <span class="caveat">&hellip;</span>

- Always call local methods in aliased form, ie. call `f()`, not `this.f()`. The former is faster as it allows pass-by-reference- _once you call between contracts, data must be copied by value_.
- Never use `now` or `block.blockhash` as a source of randomness, unless you know what you are doing!
- `now` is the time of the last block, not *really* the exact current time.
- The constructor is removed from the contract code once it is deployed since it is only ever executed once. As such, it can't be called directly.
- `for (var i = 0; i < arrayName.length; i++) { ... }` **will runaway if your array holds more than 256 elements**, because `uint8` is the smallest available datatype to hold a 0 and the variable will overflow infinitely.
- You can rely on methods being called with 2300 gas, as this is the current transaction stipend. Don't presume you'll always be allocated enough to access storage.

Further reading: http://solidity.readthedocs.io/en/latest/miscellaneous.html#pitfalls





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
- So the attacker can use a fallback function in their own contract (fired when `payOut` runs `_recipient.call.value(_amount)()`) to call `splitDAO` *while the original `splitDAO` call is still running*...
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
- Use `send` instead of `call` wherever possible. Even then, ensure you handle failures correctly, and again, update your contract's own state **first**.
  > send is safer to use since by default it doesn't forward any gas, so the receiver's fallback function can only emit events.
  >
  > <cite>http://ethereum.stackexchange.com/a/6474/2665</cite>
- Presume any call to an externally accessible contract method you define may run out of gas and fail.

???
:TODO: why are we recommending `send` instead of `call` now? Presumably to ensure only the fallback function is ever called, but I don't see how this is useful when one *does* need to `call`...

:TODO: some discussion of DAO framework v1 and test cases

:TODO: merge these in to above:
- The max call stack size is 1024. .caveat[Be sure to correctly handle the return value of `send`!]  
  http://hackingdistributed.com/2016/06/16/scanning-live-ethereum-contracts-for-bugs/  
  http://vessenes.com/ethereum-griefing-wallets-send-w-throw-considered-harmful/  
  http://vessenes.com/deconstructing-thedao-attack-a-brief-code-tour/
- manage your internal contract's state BEFORE calling other contracts. If they fail it's then THEIR problem, not yours.
- ALWAYS specify a gas amount when calling other contracts (which prevents them being attackable by sending any amount of gas)


Other observations for this bit:

- NO STATE GUARANTEES outside of your contract
- NO STATE GUARANTEES once you interact with ANY other contract
    - :TODO: check if ref vars update in response to other contracts mutating them
    - this is kinda like random thread access in a poorly threaded language
    - if the contract hash matches some source, then OK





---
<h2>More suggestions</h2>

- Learn to appreciate and understand the value of "functional programming" and how it differs from "imperative programming".
- Write unit tests for everything.
- Minimise dependencies between contracts and functions as much as possible.
- Use function modifiers to abstract conditions into annotations as much as possible.






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

- A purely functional language with a rich type system is needed. If we can't have that right now (see *"The FunArg Problem"*), we need tools to write more bug-free code in the languages we have.
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

http://themerkle.com/dao-attack-nullified-using-synereos-smart-contracting-language/ (Rholang)

Solidity 2.0 roadmap





---
<h1>Towards a better language?</h1>

Having written C, C++ and Java but also having written JavaScript using functional methodologies it's easy to see how Solidity *could* be leveraged to build rock-solid Dapps. It's also easy to see how you can shoot yourself in the foot with it. Some code smells we seem to be repeating here:

- *"Function modifiers"* in Solidity are basically like *"mixins"* in JavaScript. The only thing that differentiates them is the 
- OO-style inheritance and external library behaviour immediately makes reusing code efficiently cumbersome.
- Implicit state access between scope is always a bad idea. Always. PHP is the only imperative language I've used that manages lexical scope 'safely'.
- Being super strict with types and then automatically typecasting a complex `account` object over a 160-bit integer seems like an odd choice :/
- Creating a paradigm where monolithic contracts are the norm for efficiency reasons is bad for code quality and logic isolation reasons. I don't know if this is happening or what the solution is, but that mindset should be avoided...

???
:TODO: finish slide.

Lib funcs allow `using` / `for` to avoid the mixin collision issue, but functions from parent classes don't appear to?








---
name: in-the-meantime
# In the meantime

For now, unit tests and better code analysis tools are important. If we can write error-free code in JavaScript using linters and test runners then we can do it here, too... let's just not forget: all software is terrible and **all risks are amplified**.







---
name: unit-testing-frameworks
## Unit testing frameworks

> There are many ways to divide tests up. I tend to divide them into different “tiers”.
> 
> The first tier of tests is contract-to-contract. It involves creating a test-contract that calls the “testee” contract and processes the results. Any test-accounts that are needed would be created inside the test contracts.
> 
> The second tier would be creating a number of different accounts (through the blockchain client), deploy the contract, and use the test-accounts to transact with the contract. These accounts would all be on the same machine, using the same node.
> 
> The third tier would be setting accounts up on different machines, and do the transactions over the net.
>
> <cite>https://docs.erisindustries.com/tutorials/solidity/solidity-4/</cite>

https://github.com/smartcontractproduction/sol-unit
- Simulates executing using the JavaScript VM https://github.com/ethereumjs/ethereumjs-vm
- Interface is a base `Test` contract providing assertion methods to be extended from, which should create instances of your testee contracts internally in order to run its tests.

https://github.com/androlo/sol-tester

https://github.com/nexusdev/dapple/blob/master/doc/test.md

???
:TODO: finish this
:TODO: investigate dapple test suite







---
name: contract-base-classes
## Contract base classes 

List to come...

???
:TODO: audit this stuff again, get more specific links

- https://github.com/Arachnid/ens - Ethereum Name Service
- https://github.com/Arachnid/solidity-stringutils
- https://github.com/axic/density
- https://github.com/axic/etherboard
- https://github.com/chriseth/solidity-examples
- https://github.com/dadaista/bitshelter
- https://github.com/emailgregn/contracts
- https://github.com/fivedogit/solidity-baby-steps/
- https://github.com/FrankHold/DApp_SyntheticTrader
- https://github.com/JeffreyBPetersen/contract-testing
- https://github.com/JeffreyBPetersen/data-sharing-contracts
- https://github.com/nexusdev/dappsys
- https://github.com/nickfranklinuk/canary
- https://github.com/phillyfan1138/DArtist
- https://github.com/smartcontractproduction/dao
- https://github.com/zmitton/ethereum_escrow

......

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
- helpers for managing common fallback function & suicide behaviours



---
name: function-libraries
## Function libraries

- `CallProxy` (helper)  
  (fun `setCallTarget(account)`)  
  *(however methods are proxied?)*
- `AccountList` (datatype)  
  (fun `indexOf(account)`)

???
:TODO: 

- find a well unit-tested storage framework (or make one)
- ADTs for efficient storage
- ABI encoders & decoders

<sub>*<em>Please note: you can grab all these by running `./get-example-libs.sh` after cloning this repository.</em></sub>





---
name: final-observations
# Final observations

- The risks are high with any on-chain language- no software stack to act as padding for bugs.
- Solidity is a means of direct manipulation of the blockchain database state.
    - **State is evil!** Uh-oh...
    - Recursive calling vulnerabilities happen due to errors in *ordering state manipulations*
    - There are **no state guarantees** when interacting with external contracts
    - Better code analysis tools are needed
    - Linters and unit tests need to be the norm, at minimum
    - Better languages may be needed: OCaml or Haskell-like, code as provable theorems
- All external function calls are untrusted and could come in from anywhere.
- There are **absolutely no guarantees** as to another contract's state or behaviour unless cryptographically provable to be authored from a given source code.

???
:TODO: mention Coq as theorem prover






---
template: start
count: false
<h1>Thanks!</h1>

???
:TODO: Yep need more dumb pics fo sho
