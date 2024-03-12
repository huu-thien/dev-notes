You are right, you should do simple validations in your domain, and more precisely, in the constructors of your value objects. Crazy, huh? Not quite.

When you do that, it all becomes simpler: the validation itself is easy, no fluff and no dependencies on third party libraries, and even better: if the rest of the domain model (all other classes and methods) accept solely these value objects, and since you stop creating (throw exceptions in your VO constructors) these invalid VOs, basically you end up with a domain model which is always in a valid state - no corrupt objects ever get into your domain model.

The business validation still stays in the use cases, like Milan says, because that's where you start having semantics and context to validate the right thing in the right way.

No MediatR, no fluff.

Contrary to the masses, I believe elegance comes from simplicity, not from making complex solutions to feel better about myself.

## Validation
- Since entities should be lean and self-contained, without access to external services or repositories, they may not have access to the resources required to enforce certain validation rules. In this case, the application service can serve a mediating role and procure the resources required to enforce validity. There exist business rules that are not natural responsibilities of an entity or a validation framework.
### Jimmy Borgard 
- I tend to look at validation with at least a couple different levels:
	- Request validation: This sort of validation you can immediately return to the client and does not require any sort of domain-specific knowledge
	- Domain validation ("business rule validation"): I might be checking the state of a single entity, a group of entities, an entire collection of entities, or the entire system. The key here is I'm not checking the request against itself, but against the system state.
- While you can mix request validation and domain validation together, it's not always pretty. Validation frameworks don't mix the two together well, and these days I generally recommend against using validation frameworks for domain validation. I've done it a lot in the past and the results...just aren't great.
[Blog](https://www.jimmybogard.com/domain-command-patterns-validation/)

### [EnterPriseCraftsmanship's blog](https://enterprisecraftsmanship.com/posts/validation-and-ddd/)
#### Solution 1: IsValid method
There’s a drawback to this implementation too, and it’s quite substantial. In order to validate itself, the entity must enter an invalid state first. And that means the aggregate no longer maintains its consistency boundary. Its invariants are held loosely and can be broken at any time

#### Solution 2: checking validity in the application services layer
- The shortcoming of this approach is that it encourages business logic leakage. The Order entity is no longer accountable for holding the domain knowledge about its invariants. This responsibility is drifted away from the domain model to the application services layer.

- Also, while we do check for validity of the entity prior to calling the Deliver method, there’s nothing preventing us from assigning the entity incorrect data. Unlike in the previous code sample, we don’t actively do that but this scenario remains possible. The aggregate in this implementation still doesn’t maintain its invariants.

- This implementation is still better than the previous one, though, and it might be fine to use it in simple code bases. In complex projects, however, it’s important to keep the domain model invariants intact for maintainability reasons.
#### Solution 3: TryExecute pattern
- From the domain model purity standpoint, this approach is much better. The entity here both holds the domain knowledge and maintains its consistency. It’s impossible to transition it into an invalid state, the invariants are guaranteed to be preserved.
- *It both mutates the entity’s state and returns a value. It’s not a big deal but it would be nice to eliminate this shortcoming*
#### Solution 4: Execute / CanExecute pattern
