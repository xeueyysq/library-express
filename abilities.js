const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);

    if (user.role === 'библиотекарь') {
        can('manage', 'Book');
    } else if (user.role === 'читатель') {
        can('read', 'Book');
        can('borrow', 'Book');
        can('return', 'Book');
        can('read', 'Borrowing', { reader_id: user.id });
    } else {
        can('read', 'Book');
    }

    return new Ability(rules);
}

module.exports = { defineAbilitiesFor };