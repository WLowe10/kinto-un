declare class Kinto {
    views: any[];
    constructor();
    render: (name: string, props?: {}) => Promise<void>;
}
export default Kinto;
