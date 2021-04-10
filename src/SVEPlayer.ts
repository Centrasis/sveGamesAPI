import { SVEAccount } from "svebaselib"

export class SVEPlayer extends SVEAccount {
    constructor(account: SVEAccount) {
        super(account.getInitializer());
    }
}